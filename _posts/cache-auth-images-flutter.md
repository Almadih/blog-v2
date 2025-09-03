---
title: "Caching Authenticated Images in Flutter"
date: "2025-09-03"
published: true
tags: [flutter, caching, mobile, riverpod]
coverImage: "/assets/blog/images/flutter.png"
excerpt: "How I solved the challenge of caching authenticated images in a Flutter app using custom cache managers and proper server headers."
ogImage: 
  url: "/assets/blog/images/flutter.png"
---

## The Problem

I was building a Flutter mobile app that supports **offline usage**. One of the key features was the ability to view images even when offline, which meant I needed a proper caching solution.

If the images were **public**, this would’ve been easy — Flutter already has great packages for caching images. The challenge was that my images were **behind authentication**, requiring a token in the request headers. Unfortunately, most caching libraries in Flutter only take a simple `imageUrl`, with no option to inject headers.

## The Catch

So the real issue wasn’t just caching — it was **authenticated caching**. Every image request needed to include an `Authorization` header. None of the out-of-the-box solutions handled this scenario.

That’s where my custom solution came in.

## My Approach

I discovered the excellent [`cached_network_image`](https://pub.dev/packages/cached_network_image) package. The nice part about this library is that it allows you to provide your own **cache manager**. This gave me full control over how requests were made and stored.

To implement it, I built a **custom cache manager** using [`flutter_cache_manager`](https://pub.dev/packages/flutter_cache_manager). The key step here was creating a **custom file service** to inject my authentication headers.

---

## Code Time

Let’s start with the widget that displays authenticated images:

```dart
class AuthenticatedImage extends ConsumerStatefulWidget {
  final int imageId;
  final BoxFit fit;
  final double? width;
  final double? height;

  const AuthenticatedImage({
    super.key,
    required this.imageId,
    this.fit = BoxFit.cover,
    this.width,
    this.height,
  });

  @override
  ConsumerState<AuthenticatedImage> createState() => _AuthenticatedImageState();
}

class _AuthenticatedImageState extends ConsumerState<AuthenticatedImage> {
  Key _imageKey = UniqueKey();

  void _retry() {
    setState(() {
      _imageKey = UniqueKey();
    });
  }

  @override
  Widget build(BuildContext context) {
    final imagesCacheManager = ref.watch(imageCacheManagerProvider);
    final String imageUrl = '/image/${widget.imageId}';

    return CachedNetworkImage(
      key: _imageKey,
      imageUrl: imageUrl,
      cacheManager: imagesCacheManager,
      imageBuilder: (context, imageProvider) => Image(
        image: imageProvider,
        fit: widget.fit,
        width: widget.width,
        height: widget.height,
      ),
      placeholder: (context, url) => const Center(
        child: CircularProgressIndicator(strokeWidth: 3),
      ),
      errorWidget: (context, url, error) => Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.broken_image, color: Colors.grey, size: 40),
          TextButton(onPressed: _retry, child: const Text('Retry')),
        ],
      ),
    );
  }
}
```

Here, `imageCacheManagerProvider` is a **Riverpod provider** that holds our custom cache manager, keeping it alive as a singleton.

---

### Custom Cache Manager

```dart
class AuthenticatedCacheManager extends CacheManager {
  static const key = 'authenticatedImageCache_v3';

  AuthenticatedCacheManager({required dio.Dio dio}): super(
          Config(
            key,
            repo: JsonCacheInfoRepository(databaseName: key),
            fileService: CustomFileService(dio),
          ),
    );
}
```

This cache manager uses a `CustomFileService` that makes authenticated requests.

---

### Custom File Service

```dart
class CustomFileService extends FileService {
  final dio.Dio _dio;

  CustomFileService(this._dio);

  @override
  Future<FileServiceResponse> get(String url, {Map<String, String>? headers}) async {
    try {
      final token = 'auth token'; // Fetch from secure storage
      final uri = Uri.parse(url);
      final apiPath = uri.path;

      _dio.options = dio.BaseOptions(baseUrl: ApiConfig.baseUrl);

      final response = await _dio.get(
        apiPath,
        options: dio.Options(
          responseType: dio.ResponseType.bytes,
          headers: {'Authorization': 'Bearer $token'},
        ),
      );

      final streamedResponse = http.StreamedResponse(
        Stream.value(response.data as List<int>),
        response.statusCode!,
        request: http.Request('GET', uri),
        contentLength: response.data.length,
        headers: {
          for (var entry in response.headers.map.entries)
            entry.key: entry.value.join(','),
        },
      );

      return HttpGetResponse(streamedResponse);
    } on dio.DioException catch (e) {
      final streamedResponse = http.StreamedResponse(
        const Stream.empty(),
        e.response?.statusCode ?? 500,
      );
      return HttpGetResponse(streamedResponse);
    }
  }
}
```

Now, every image fetch includes the **Bearer token** in the headers, and the cache manager handles storing the result locally.

---

## The Missing Piece

At first, I was confused why caching still didn’t work properly. Then I realized: caching isn’t just a **client-side** concern. The **server must allow caching**.

That means setting proper `Cache-Control` headers on the API response. For example, in a Laravel controller:

```php
return response($file, 200)
    ->header('Content-Type', $mimeType)
    ->header('Cache-Control', 'public, max-age=2592000'); // 30 days
```

Without these headers, the cache manager assumes the resource is **not cacheable**, no matter what you do on the client.

---

## Conclusion

This might look like an over-engineered setup for something as “simple” as images, but it solved the real-world challenge of caching **authenticated** resources.

The key takeaways:
- Use `cached_network_image` with a custom cache manager.
- Write a custom `FileService` to inject auth headers.
- Don’t forget server-side caching headers — they’re just as important.

With this setup, my users can now view their private images **offline**, without re-fetching them every time. 🚀