import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Edit, Upload } from "lucide-react";
import { userAuthStore } from "../../store/userAuthStore";
import { useToast } from "../../components/ui/ToastContext";
import SEO from "../../components/common/SEO";

function ProfilePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const currentUser = userAuthStore.getUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setUser(currentUser);
    setFormData(currentUser);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      // Here you would typically make an API call to update the user
      // For now, we'll just update the local storage
      userAuthStore.setUser(formData);
      setUser(formData);
      setIsEditing(false);
      showToast("Profile updated successfully!", "success");
    } catch (error) {
      showToast("Failed to update profile", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <SEO 
        title="My Profile"
        description="View and manage your profile"
      />
      
      <div className="min-h-screen bg-[var(--bg-primary)] pt-24 pb-16">
        <div className="mx-auto max-w-2xl px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[var(--text-primary)]">
              My Profile
            </h1>
            <p className="mt-2 text-[var(--text-muted)]">
              Manage your account information
            </p>
          </div>

          {/* Profile Card */}
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--surface)] p-8 shadow-lg">
            {/* Avatar Section */}
            <div className="mb-8 flex flex-col items-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-24 w-24 rounded-full object-cover ring-4 ring-[var(--accent-pink)]/20"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-pink)] to-[var(--accent-purple)]">
                  <User className="h-12 w-12 text-white" />
                </div>
              )}
              {isEditing && (
                <button className="mt-4 flex items-center gap-2 rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-hover)]">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] px-4 py-2.5 text-[var(--text-primary)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] px-4 py-2.5 text-[var(--text-primary)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] px-4 py-2.5 text-[var(--text-primary)] transition-all disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-6">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-6 py-2.5 font-semibold text-white transition-all hover:shadow-lg"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="flex-1 rounded-lg bg-gradient-to-r from-[var(--accent-pink)] to-[var(--accent-purple)] px-6 py-2.5 font-semibold text-white transition-all hover:shadow-lg disabled:opacity-60"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setFormData(user);
                      }}
                      className="rounded-lg border border-[var(--card-border)] bg-[var(--bg-primary)] px-6 py-2.5 font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--surface-hover)]"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
