import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Plus, X, Video, Upload } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "../../services/api";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import Modal from "../../components/admin/Modal";
import { getErrorMessage } from "../../utils/errors";
import { optimizeCloudinaryUrl } from "../../utils/cloudinary";

const CLOUDINARY_CLOUD_NAME = "zyfxigcj";
const CLOUDINARY_UPLOAD_PRESET = "FitnessZone";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  banner_url: null,
  lessons: [{ title: "", youtube_link: "" }],
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setBannerFile(null);
    setBannerPreview(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setFormData({
      title: course.title,
      description: course.description || "",
      price: course.price,
      banner_url: course.banner_url || null,
      lessons:
        course.lessons.length > 0
          ? course.lessons.map((l) => ({ title: l.title, youtube_link: l.youtube_link }))
          : [{ title: "", youtube_link: "" }],
    });
    setEditingId(course._id);
    setBannerFile(null);
    setBannerPreview(course.banner_url || null);
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const uploadBannerToCloudinary = async () => {
    const uploadData = new FormData();
    uploadData.append("file", bannerFile);
    uploadData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      uploadData,
    );
    return res.data.secure_url;
  };

  const handleLessonChange = (index, field, value) => {
    const lessons = [...formData.lessons];
    lessons[index] = { ...lessons[index], [field]: value };
    setFormData({ ...formData, lessons });
  };

  const addLesson = () => {
    setFormData({
      ...formData,
      lessons: [...formData.lessons, { title: "", youtube_link: "" }],
    });
  };

  const removeLesson = (index) => {
    setFormData({
      ...formData,
      lessons: formData.lessons.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      lessons: formData.lessons.filter((l) => l.title && l.youtube_link),
    };
    if (payload.lessons.length === 0) {
      toast.error("Add at least one lesson with a title and video link");
      return;
    }
    setSaving(true);
    try {
      if (bannerFile) {
        payload.banner_url = await uploadBannerToCloudinary();
      }
      if (editingId) {
        await api.put(`/courses/${editingId}`, payload);
        toast.success("Course updated");
      } else {
        await api.post("/courses", payload);
        toast.success("Course created");
      }
      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      toast.error(getErrorMessage(err, "Something went wrong"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course? This can't be undone.")) return;
    try {
      await api.delete(`/courses/${id}`);
      toast.success("Course removed");
      fetchCourses();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete course"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
        <motion.h1
          className="text-2xl font-bold text-brand-blue"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Recorded Content
        </motion.h1>
        <Button onClick={openAddModal}>
          <span className="flex items-center gap-2">
            <Plus size={16} /> Add Course
          </span>
        </Button>
      </div>

      <p className="text-brand-blue-light text-sm mb-6">
        A course is a group of unlisted YouTube video lessons, sold like an
        e-book. Clients only see the video links after purchasing.
      </p>

      {loading ? (
        <Loader />
      ) : courses.length === 0 ? (
        <p className="text-brand-blue-light text-sm">
          No courses yet — add one to sell on the E-Books & Courses page.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course._id}>
              {course.banner_url && (
                <div className="aspect-video mb-3 -mt-1 rounded-lg overflow-hidden bg-brand-blue-pale">
                  <img
                    src={optimizeCloudinaryUrl(course.banner_url, 500)}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <h3 className="text-brand-blue font-bold text-lg mb-1">
                {course.title}
              </h3>
              <p className="text-brand-blue-light text-sm mb-2">
                {course.description}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-brand-blue-light mb-2">
                <Video size={13} /> {course.lessons.length} lesson
                {course.lessons.length === 1 ? "" : "s"}
              </p>
              <p className="text-brand-blue font-semibold mb-4">
                ₹{course.price.toLocaleString("en-IN")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => openEditModal(course)}
                  className="text-brand-blue-light hover:text-brand-blue rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  aria-label={`Edit ${course.title}`}
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="text-red-400 hover:text-red-600 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                  aria-label={`Delete ${course.title}`}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Course" : "Add Course"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-14 rounded-lg bg-brand-blue-pale overflow-hidden flex items-center justify-center flex-shrink-0">
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Upload size={18} className="text-brand-blue/40" />
              )}
            </div>
            <label className="cursor-pointer text-sm font-semibold text-brand-orange">
              {bannerFile ? "Change Banner" : "Upload Banner (optional)"}
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerSelect}
                className="hidden"
              />
            </label>
          </div>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full border border-brand-blue-pale rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />

          <div>
            <p className="text-xs font-semibold text-brand-blue-light mb-2">
              Lessons (unlisted YouTube links)
            </p>
            <div className="space-y-3">
              {formData.lessons.map((lesson, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      placeholder={`Lesson ${i + 1} Title`}
                      value={lesson.title}
                      onChange={(e) =>
                        handleLessonChange(i, "title", e.target.value)
                      }
                      className="w-full border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                    <input
                      type="text"
                      placeholder="YouTube Link (unlisted)"
                      value={lesson.youtube_link}
                      onChange={(e) =>
                        handleLessonChange(i, "youtube_link", e.target.value)
                      }
                      className="w-full border border-brand-blue-pale rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange"
                    />
                  </div>
                  {formData.lessons.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLesson(i)}
                      className="text-red-400 hover:text-red-600 mt-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange"
                      title="Remove lesson"
                      aria-label={`Remove lesson ${i + 1}`}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addLesson}
              className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:underline"
            >
              <Plus size={14} /> Add Lesson
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Course"}
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;
