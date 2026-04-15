import { useState } from 'react';
import { X } from 'lucide-react';
import apiClient from '../api/apiClient';
import { toast } from 'react-toastify';

export default function AddMovieModal({ isOpen, onClose, onMovieAdded }) {
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    rating: '',
    description: '',
    posterUrl: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/movies', formData);
      toast.success('Movie added successfully!', { theme: "dark" });
      onMovieAdded(response.data);
      onClose();
      setFormData({ title: '', genre: '', rating: '', description: '', posterUrl: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to connect to backend.', { theme: "dark" });
      // For local testing fallback if backend is down:
      const dummyMovie = { ...formData, id: Date.now() };
      toast.info('Added locally (Backend down)', { theme: "dark" });
      onMovieAdded(dummyMovie);
      onClose();
      setFormData({ title: '', genre: '', rating: '', description: '', posterUrl: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Add New Movie</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" placeholder="e.g. Inception" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Genre</label>
              <input required type="text" name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" placeholder="e.g. Sci-Fi" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Rating</label>
              <input required type="number" step="0.1" max="10" name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" placeholder="e.g. 8.8" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Poster URL</label>
            <input type="url" name="posterUrl" value={formData.posterUrl} onChange={handleChange} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500" placeholder="https://... (Optional)" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-amber-500 resize-none" placeholder="A brief description of the movie..."></textarea>
          </div>
          
          <div className="pt-2">
            <button disabled={isSubmitting} type="submit" className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-bold py-3 rounded-lg transition-colors">
              {isSubmitting ? 'Adding...' : 'Add Movie'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
