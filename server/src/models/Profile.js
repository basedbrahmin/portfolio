import mongoose from 'mongoose';

// Single-document collection holding the hero/about copy.
const profileSchema = new mongoose.Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
    roles: [String],
    headline: String,
    bio: String,
    location: String,
    status: String,
    focus: String,
    email: String,
    phone: String,
    photo: String,
    socials: [{ label: String, url: String, _id: false }],
  },
  { collection: 'profile' }
);

export default mongoose.model('Profile', profileSchema);
