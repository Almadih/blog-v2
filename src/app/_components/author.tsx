import { getAuthor } from "@/lib/author";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import Image from "next/image";

export default function Author() {
  const author = getAuthor();
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse" />
        <div className="relative h-20 w-20 mr-6 rounded-full ring-4 ring-white/20 overflow-hidden">
          <Image
            src={author.picture}
            alt="John Developer"
            fill
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
        </div>
      </div>
      <div className="text-left">
        <h3 className="font-bold text-xl text-white">{author.name}</h3>
        <p className="text-white/70 mb-2">{author.bio}</p>
        <div className="flex items-center space-x-3">
          <a href={author.linkedin} target="_blank" rel="noreferrer">
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
              <Linkedin className="h-6 w-6" />
            </button>
          </a>
          <a href={author.twitter} target="_blank" rel="noreferrer">
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
              <Twitter className="h-6 w-6" />
            </button>
          </a>
          <a href={author.github} target="_blank" rel="noreferrer">
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-md transition-colors">
              <Github className="h-6 w-6" />
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
