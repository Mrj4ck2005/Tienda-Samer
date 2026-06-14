import { supabase } from '@/lib/db/supabase';

export const uploadImage = async (
  file: File
): Promise<string> => {
  const fileExt = file.name.split('.').pop();

  const fileName =
    `${Date.now()}_${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;

  const { error } = await supabase.storage
    .from('productos')
    .upload(fileName, file);

  if (error) {
    console.error(error);
    throw error;
  }

  const { data } = supabase.storage
    .from('productos')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const deleteImage = async (
  imageUrl: string
): Promise<void> => {
  try {
    const fileName = imageUrl.split('/').pop();

    if (!fileName) {
      throw new Error(
        'No se pudo obtener el nombre del archivo'
      );
    }

    console.log(
      'Eliminando archivo:',
      fileName
    );

    const { error } = await supabase.storage
      .from('productos')
      .remove([fileName]);

    if (error) {
      console.error(
        'Error Supabase:',
        error
      );
      throw error;
    }

    console.log(
      'Imagen eliminada correctamente'
    );
  } catch (err) {
    console.error(err);
    throw err;
  }
};