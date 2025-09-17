"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X, Loader2 } from "lucide-react";
import { 
  useUploadColaboradorImageMutation,
  useUploadColaboradorImageBase64Mutation 
} from "@/store/services/imageUpload";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  colaboradorId?: string;
  iniciales?: string;
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
}

export function ImageUpload({ 
  currentImageUrl, 
  colaboradorId, 
  iniciales = "??", 
  onImageUploaded,
  className = ""
}: ImageUploadProps) {
  // Función para construir URL completa
  const buildFullImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "";
    
    // Si ya es una URL completa (http/https), la devolvemos tal como está
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // Si es una URL relativa que empieza con /uploads, construimos la URL completa
    if (imageUrl.startsWith('/uploads')) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://localhost:7232';
      return `${baseUrl}${imageUrl}`;
    }
    
    // Para otros casos, intentamos construir la URL con el API base
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:7232/api';
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const [previewUrl, setPreviewUrl] = useState<string>(buildFullImageUrl(currentImageUrl));
  const [isUploading, setIsUploading] = useState(false);
  
  // Sincronizar previewUrl con currentImageUrl cuando cambie
  useEffect(() => {
    const fullUrl = buildFullImageUrl(currentImageUrl);
    console.log('ImageUpload - URL procesada:', { 
      original: currentImageUrl, 
      processed: fullUrl 
    });
    setPreviewUrl(fullUrl);
  }, [currentImageUrl]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadImage] = useUploadColaboradorImageMutation();
  const [uploadImageBase64] = useUploadColaboradorImageBase64Mutation();

  // Función auxiliar para convertir archivo a base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validaciones básicas
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (file.size > maxSize) {
      toast.error("El archivo es demasiado grande. Máximo 5MB.");
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Use JPG, PNG, GIF o WebP.");
      return;
    }

    // Crear preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload automático
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    
    try {
      console.log('Uploading file:', {
        name: file.name,
        size: file.size,
        type: file.type,
        colaboradorId,
        apiUrl: process.env.NEXT_PUBLIC_API_URL
      });

      let response;
      
      try {
        // Intentar primero con FormData
        const formData = new FormData();
        formData.append('ImageFile', file);
        if (colaboradorId) {
          formData.append('ColaboradorId', colaboradorId);
        }

        // Log FormData content for debugging
        for (let [key, value] of formData.entries()) {
          console.log(`FormData ${key}:`, value);
        }

        response = await uploadImage(formData).unwrap();
        console.log('FormData upload response:', response);
        
      } catch (formDataError: any) {
        console.log('FormData upload failed, trying Base64:', formDataError);
        
        // Si FormData falla, intentar con Base64
        const base64Image = await fileToBase64(file);
        const fileName = file.name.split('.')[0] || 'avatar';
        
        const base64Data = {
          base64Image,
          fileName,
          colaboradorId: colaboradorId || undefined
        };
        
        response = await uploadImageBase64(base64Data).unwrap();
        console.log('Base64 upload response:', response);
      }
      
      // La respuesta exitosa puede venir en diferentes formatos
      if (response && (response.success === true || response.data)) {
        const imageUrl = response.data?.imageUrl;
        
        console.log('Received imageUrl from server:', imageUrl);
        console.log('API URL from env:', process.env.NEXT_PUBLIC_API_URL);
        
        if (imageUrl) {
          // Verificar si la URL ya es completa o necesita el prefijo
          let fullImageUrl;
          
          if (imageUrl.startsWith('http')) {
            // Ya es una URL completa
            fullImageUrl = imageUrl;
          } else if (imageUrl.startsWith('/uploads')) {
            // La URL de uploads no debe incluir /api, solo el dominio base
            const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://localhost:7232';
            fullImageUrl = `${baseUrl}${imageUrl}`;
          } else if (imageUrl.startsWith('/api')) {
            // La URL ya incluye /api, solo agregamos el dominio
            fullImageUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${imageUrl}`;
          } else {
            // URL relativa para endpoints API, agregamos todo el prefijo
            fullImageUrl = `${process.env.NEXT_PUBLIC_API_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
          }
          
          console.log('Final image URL:', fullImageUrl);
          
          setPreviewUrl(fullImageUrl);
          onImageUploaded(fullImageUrl);
          toast.success("Imagen subida exitosamente");
        } else {
          throw new Error("No se recibió URL de imagen en la respuesta");
        }
      } else {
        throw new Error(response?.message || "Respuesta inesperada del servidor");
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      
      // Log más detallado del error
      console.error('Error details:', {
        status: error?.status,
        data: error?.data,
        originalStatus: error?.originalStatus,
        message: error?.message
      });
      
      // Manejar diferentes tipos de errores
      let errorMessage = "Error al subir la imagen";
      
      if (error?.status === 400) {
        errorMessage = error?.data?.message || "Datos de imagen inválidos";
      } else if (error?.status === 401) {
        errorMessage = "No autorizado. Por favor inicie sesión nuevamente";
      } else if (error?.status === 404) {
        errorMessage = "Endpoint de upload no encontrado. Verifique la configuración del servidor";
      } else if (error?.status === 413) {
        errorMessage = "El archivo es demasiado grande";
      } else if (error?.status === 415) {
        errorMessage = "Tipo de archivo no soportado";
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      
      // Revertir preview en caso de error
      setPreviewUrl(currentImageUrl || "");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>Foto de Perfil</Label>
      
      <div className="flex items-center gap-4">
        {/* Avatar Preview */}
        <div className="relative">
          <Avatar className="h-16 w-16">
            <AvatarImage src={previewUrl} alt="Preview" />
            <AvatarFallback className="text-lg">
              {iniciales}
            </AvatarFallback>
          </Avatar>
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={triggerFileSelect}
            disabled={isUploading}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {isUploading ? "Subiendo..." : "Subir Imagen"}
          </Button>
          
          {previewUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Quitar
            </Button>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Helper text */}
      <p className="text-xs text-muted-foreground">
        Formatos permitidos: JPG, PNG, GIF, WebP. Máximo 5MB.
        <br />
        La imagen se redimensionará automáticamente a 500x500 píxeles.
      </p>
    </div>
  );
}