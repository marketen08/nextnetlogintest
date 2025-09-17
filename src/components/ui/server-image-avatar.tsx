"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ServerImageAvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ServerImageAvatar({ 
  src, 
  alt, 
  fallback, 
  className = "",
  size = "md" 
}: ServerImageAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10", 
    lg: "h-16 w-16"
  };

  // Construir URL completa si es necesario
  const imageUrl = src && !imageError ? (() => {
    if (src.startsWith('http')) {
      return src;
    } else if (src.startsWith('/uploads')) {
      // Las URLs de uploads no deben incluir /api
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://localhost:7232';
      return `${baseUrl}${src}`;
    } else {
      // Otras URLs (endpoints API) sí incluyen /api
      return `${process.env.NEXT_PUBLIC_API_URL}${src}`;
    }
  })() : undefined;

  // Log para debugging
//   console.log('ServerImageAvatar:', {
//     originalSrc: src,
//     finalImageUrl: imageUrl,
//     apiUrl: process.env.NEXT_PUBLIC_API_URL,
//     imageError
//   });

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {imageUrl && (
        <AvatarImage 
          src={imageUrl}
          alt={alt}
          onError={() => setImageError(true)}
        />
      )}
      <AvatarFallback className={cn(
        "text-xs",
        size === "lg" && "text-sm",
        size === "sm" && "text-xs"
      )}>
        {fallback}
      </AvatarFallback>
    </Avatar>
  );
}