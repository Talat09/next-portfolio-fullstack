// Shared data types for the portfolio (match the mongoose schemas + API responses)

export interface BaseDocument {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface HomeData {
  heading: string;
  summary: string;
}
export type Home = HomeData & BaseDocument;

export interface AboutData {
  aboutme: string;
  noofprojects: string;
  yearofexperience: string;
  noofclients: string;
  skills: string;
  whyhirelabel?: string;
  whyhireheading?: string;
  whyhirehighlight?: string;
}
export type About = AboutData & BaseDocument;

export interface ExperienceData {
  position: string;
  company: string;
  duration: string;
  location: string;
  jobprofile: string;
}
export type Experience = ExperienceData & BaseDocument;

export interface EducationData {
  degree: string;
  year: string;
  college: string;
}
export type Education = EducationData & BaseDocument;

export interface ProjectData {
  name: string;
  website: string;
  technologies: string;
  github: string;
  /** Project screenshot URL (Cloudinary secure_url); empty = no image */
  image?: string;
  /** Display position set via admin drag-and-drop (0 = first) */
  order?: number;
}
export type Project = ProjectData & BaseDocument;

export interface ContactData {
  name: string;
  email: string;
  message: string;
}
export type Contact = ContactData & BaseDocument;

export interface ContactInfoData {
  label?: string;
  heading?: string;
  highlight?: string;
  intro?: string;
  email?: string;
  location?: string;
}
export type ContactInfo = ContactInfoData & BaseDocument;

export interface UserData {
  username: string;
  password: string;
}
export type User = UserData & BaseDocument;

export interface LoginFormData {
  username: string;
  password: string;
}

/** Shape every API route returns */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

/** Section / tab ids used by the API (`/api/<tab>/...`) */
export type SectionTab =
  | "home"
  | "about"
  | "experience"
  | "education"
  | "project"
  | "contact"
  | "contact-info";

/** Generic form state: every field is a string */
export type FormValues = Record<string, string | undefined>;

export type ControlType =
  | "text"
  | "email"
  | "url"
  | "number"
  | "password"
  | "textarea"
  | "select";

export interface SelectOption {
  value: string;
  label: string;
}

export interface FormControl {
  name: string;
  label: string;
  placeholder?: string;
  type: ControlType;
  options?: Array<string | SelectOption>;
  helperText?: string;
  min?: number;
}
