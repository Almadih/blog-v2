---
title: "Boosting Map Performance with Materialized Views in Postgres"
date: "2025-09-05"
published: true
tags: [postgresql, laravel, geospatial]
coverImage: "/assets/blog/images/postgres.png"
excerpt: "Learn how to use PostgreSQL materialized views to efficiently generate heatmaps from geospatial data without slowing down your app."
ogImage: 
    url: "/assets/blog/images/postgres.png"
---

## The Goal

I had geospatial data in a PostgreSQL database that I wanted to display as a **heatmap for the last 7 days**.  
The straightforward approach was to query the raw `reports` table every time the page loads.  

But when you’re dealing with **thousands of rows**, that becomes painfully inefficient.  

So, how do we make this fast?

---

## The Solution: Materialized Views

A **materialized view** is like a cached version of a query. Unlike a normal view, which runs the query every time it’s accessed, a materialized view stores the result **physically on disk**.  

This makes it perfect for cases where:
- The query is expensive (geospatial + date filters).
- The data doesn’t change every second.
- You want **fast lookups** without hammering the main table.

---

## Defining a Materialized View

Here’s a simple example:

```sql
CREATE MATERIALIZED VIEW view_name AS
SELECT
    -- query here
FROM
	-- target table here
WHERE
	-- condition here
	
```

In my case, I had a `reports` table with a `location` column (geometry point with latitude/longitude).  
I created a materialized view that **snaps points into grid cells** and counts reports per cell.

Here’s the migration in Laravel:

```php
DB::statement('
CREATE MATERIALIZED VIEW mv_heatmap_cells AS
SELECT
    MD5(ST_AsText(ST_SnapToGrid(r.location, 0.01, 0.01)))::uuid AS cell_id,
    ST_SnapToGrid(r.location, 0.01, 0.01) AS geom,
    COUNT(*) AS report_count,
    CURRENT_DATE AS data_until_date
FROM reports r
WHERE r.created_at >= (CURRENT_DATE - INTERVAL \'6 days\')
  AND r.created_at < (CURRENT_DATE + INTERVAL \'1 day\')
GROUP BY geom;
');

DB::statement('CREATE UNIQUE INDEX IF NOT EXISTS uidx_mv_heatmap_cells_cell_id ON mv_heatmap_cells (cell_id);');
DB::statement('CREATE INDEX IF NOT EXISTS idx_mv_heatmap_cells_week_geom ON mv_heatmap_cells (cell_id, geom);');
DB::statement('CREATE INDEX IF NOT EXISTS idx_mv_heatmap_cells_geom_gist ON mv_heatmap_cells USING GIST (geom);');

```

### What’s Happening Here?

- **Cell ID**: I used an MD5 hash of the grid cell as a unique identifier.
- **ST_SnapToGrid**: Groups all points into a grid of `0.01 x 0.01` units.
- **Report Count**: Counts how many reports fall into each grid cell.
- **7-Day Filter**: Only considers reports created in the last 7 days.
- **Indexes**: Added for faster queries.
## Keeping It Fresh

A materialized view doesn’t update automatically. You need to **refresh** it:

```sql
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_heatmap_cells;
```

In Laravel, I made a command and hooked it into the scheduler:

```php
class RefreshHeatmapCells extends Command
{
    protected $signature = 'app:refresh-heatmap-cells';
    protected $description = 'Refresh heatmap cells materialized view.';

    public function handle()
    {
        DB::statement('REFRESH MATERIALIZED VIEW CONCURRENTLY mv_heatmap_cells;');
    }
}

```

This way, the view stays up-to-date without blocking queries.

---

## Displaying on a Map

Finally, let’s put it on a map using Vue and Google Maps:

```vue
<script lang="ts" setup>
import axios from 'axios';
import { ref, watch, onMounted } from 'vue';

const center = ref({ lat: 30.89, lng: 29.87 });
const heatmapData = ref([]);
const mapRef = ref<google.maps.Map | null>(null);

const fetchHeatmapData = () => {
  axios.get(route('reports-heatmap')).then((res) => {
    heatmapData.value = res.data.rows.map((feature: any) => {
      const geometry = JSON.parse(feature.geometry);
      const props = JSON.parse(feature.properties);
      return {
        location: new google.maps.LatLng(geometry.coordinates[1], geometry.coordinates[0]),
        weight: props.report_count * 10
      };
    });
  });
};

const mapLoaded = (map: any) => { mapRef.value = map; };

watch([mapRef], () => { if (mapRef.value) fetchHeatmapData(); });
</script>

<template>
  <Map :center="center" :zoom="8" @map:loaded="mapLoaded" class="h-[500px]">
    <GMapHeatmap :data="heatmapData" />
  </Map>
</template>

```

Here, the **report count** is used as the weight of each heatmap point.  
You could get fancier by adding weights based on priority, severity, or other attributes.

---
## Wrapping Up

With **materialized views**, you can:

- Pre-compute expensive queries.
- Keep your heatmaps responsive even with thousands of rows.
- Control when to refresh the data.

This approach gives you the best of both worlds: performance and flexibility. 🚀