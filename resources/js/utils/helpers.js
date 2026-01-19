import axios from 'axios';

export async function uploadEditorImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post(route('editor.image.upload'), formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
}
