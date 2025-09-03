-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  project_description TEXT NOT NULL,
  files JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'quoted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  applications TEXT,
  icon VARCHAR(100),
  gradient VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default services
INSERT INTO services (title, subtitle, description, features, applications, icon, gradient, sort_order) VALUES
('CNC Machining', 'Milling & Turning', 'State-of-the-art CNC machining capabilities for complex geometries and tight tolerances. Our advanced milling and turning centers can handle a wide range of materials and part sizes.',
 '["3, 4, and 5-axis milling capabilities", "Multi-axis turning with live tooling", "Tolerances as tight as ±0.0001\"", "Materials: Aluminum, Steel, Stainless, Titanium, Plastics"]'::jsonb,
 'Aerospace components, Medical devices, Automotive parts, Industrial equipment', 'cog', 'from-blue-500 to-cyan-500', 1),

('Die and Mold Manufacturing', 'Custom Tooling Solutions', 'Precision die and mold manufacturing for injection molding, die casting, and stamping applications. We create durable tooling that delivers consistent results over thousands of cycles.',
 '["Injection mold design and manufacturing", "Die casting dies and tooling", "Progressive and transfer dies", "Mold maintenance and repair services"]'::jsonb,
 'Consumer products, Automotive components, Electronics housings, Medical devices', 'wrench', 'from-purple-500 to-pink-500', 2),

('Die Casting', 'High-Volume Production', 'High-pressure die casting services for aluminum, zinc, and magnesium alloys. Perfect for high-volume production runs with excellent surface finish and dimensional accuracy.',
 '["Hot chamber and cold chamber processes", "Secondary operations and finishing", "Quality control and inspection", "Volume capabilities from 100 to 100,000+ parts"]'::jsonb,
 'Automotive parts, Electronics components, Hardware and fixtures, Industrial components', 'factory', 'from-green-500 to-emerald-500', 3),

('Metal Fabrication', 'Custom Metalwork', 'Comprehensive metal fabrication services including cutting, forming, welding, and assembly. From simple brackets to complex weldments, we handle projects of all sizes.',
 '["Laser cutting and plasma cutting", "Press brake forming and rolling", "TIG, MIG, and stick welding", "Powder coating and finishing services"]'::jsonb,
 'Structural components, Enclosures and housings, Custom machinery, Architectural elements', 'hammer', 'from-orange-500 to-red-500', 4),

('Extrusion', 'Continuous Profiles', 'Aluminum and plastic extrusion services for continuous profile manufacturing. Ideal for creating consistent cross-sections in long lengths with excellent surface quality.',
 '["Custom die design and manufacturing", "Aluminum and plastic extrusion", "Secondary operations and machining", "Anodizing and finishing options"]'::jsonb,
 'Window and door frames, Heat sinks, Structural profiles, Decorative trim', 'layers', 'from-indigo-500 to-purple-500', 5),

('Rapid Prototyping', 'Fast Design Validation', 'Quick-turn prototyping services to validate your designs before full production. Multiple manufacturing processes available to match your production intent.',
 '["3D printing and additive manufacturing", "CNC machined prototypes", "Vacuum casting and urethane casting", "Functional testing and validation"]'::jsonb,
 'Product development, Design validation, Functional testing, Market research', 'zap', 'from-yellow-500 to-orange-500', 6);

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: castpro2024)
INSERT INTO admin_users (username, password_hash, email) VALUES
('admin', '$2b$10$rOvHPGkwQGKqvzjJMjqzUeX8kZqJQGKqvzjJMjqzUeX8kZqJQGKqvz', 'admin@castproengineering.com');

-- Create applications table (for career page submissions)
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  message TEXT,
  files JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_listings table (for jobs/internships managed from admin)
CREATE TABLE IF NOT EXISTS career_listings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('job', 'internship')),
  location VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  requirements JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default career listings
INSERT INTO career_listings (title, type, location, description, requirements, is_active) VALUES
('Senior CNC Machinist', 'job', 'Rawalpindi, Pakistan', 'Experienced CNC machinist for complex aerospace and medical components. Must be proficient in 5-axis machining and blueprint reading.', '["5+ years experience", "Proficiency in 5-axis machining", "Strong blueprint reading", "Ability to work independently"]'::jsonb, true),
('Die Casting Engineer', 'job', 'Rawalpindi, Pakistan', 'Engineer with expertise in high-pressure die casting processes and optimization. Responsible for process improvement and quality control.', '["Bachelor''s in Mechanical Engineering", "3+ years die casting experience", "Process optimization skills", "Strong analytical abilities"]'::jsonb, true),
('Mechanical Engineering Intern', 'internship', 'Rawalpindi, Pakistan', 'Assist engineers in design, analysis, and testing of manufacturing processes. Gain hands-on experience in a fast-paced environment.', '["Currently pursuing Mechanical Engineering degree", "Basic CAD skills", "Eagerness to learn and proactive attitude"]'::jsonb, true),
('Manufacturing Operations Intern', 'internship', 'Rawalpindi, Pakistan', 'Support daily production operations and process efficiency initiatives. Work closely with production teams to identify areas for improvement.', '["Currently pursuing Industrial/Manufacturing Engineering", "Problem-solving skills", "Team player with good communication"]'::jsonb, true);


-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_career_listings_updated_at BEFORE UPDATE ON career_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
