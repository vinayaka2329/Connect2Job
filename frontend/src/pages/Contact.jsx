// // // src/pages/Contact.jsx
// // import { useState } from 'react';

// // import { useAppContext } from '../context/AppContext';
// // import AnimatedBackground from '../components/AnimatedBackground';
// // import { contactInfo } from '../data/siteData';
// // import { api } from '../services/api';
// // import './Contact.css';

// // export default function Contact() {
// //   // const { showToast, addContact } = useAppContext();
// //   const { showToast } = useAppContext();
// //   const [form, setForm] = useState({ 
// //     name: '', 
// //     email: '', 
// //     phone: '', 
// //     subject: '',
// //     message: '' 
// //   });
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const handleChange = (e) => {
// //     const { name, value } = e.target;
// //     setForm(prev => ({ ...prev, [name]: value }));
// //   };

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
    
// //     // Validate required fields
// //     if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
// //       showToast('Please fill in all required fields.', 'error');
// //       return;
// //     }

// //     // Email validation
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(form.email)) {
// //       showToast('Please enter a valid email address.', 'error');
// //       return;
// //     }

// //     setIsSubmitting(true);

// //     const contactData = {
// //       name: form.name.trim(),
// //       email: form.email.trim(),
// //       phone: form.phone.trim(),
// //       subject: form.subject.trim() || 'General Inquiry',
// //       message: form.message.trim(),
// //     };

// //     try {
// //       console.log('📤 Sending contact data:', contactData);
      
// //       const response = await api.sendContact(contactData);
// //       console.log('✅ Response received:', response);

// //       // Save to context/localStorage as backup
// //       // addContact(contactData);

// //       // Reset form
// //       setForm({
// //         name: '',
// //         email: '',
// //         phone: '',
// //         subject: '',
// //         message: ''
// //       });

// //       showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
// //     } catch (err) {
// //       console.error('❌ Error sending contact:', err);
// //       showToast('❌ Failed to send message. Please try again later.', 'error');
// //     } finally {
// //       setIsSubmitting(false);
// //     }
// //   };

// //   return (
// //     <>
// //       <AnimatedBackground />
// //       <section className="contact-page page-section">
// //         <div className="container">
// //           <div className="page-hero" data-aos="fade-up">
// //             <span className="section-badge">Contact Us</span>
// //             <h1>
// //               Let's Build Your <span className="highlight">Career</span> Together
// //             </h1>
// //             <p>Reach out for hiring support, job opportunities, or any general inquiries.</p>
// //           </div>

// //           <div className="contact-wrapper" data-aos="fade-up" data-aos-delay="150">
// //             {/* Contact Info */}
// //             <div className="contact-info-section" data-aos="fade-right" data-aos-duration="800">
// //               <h2>
// //                 Contact <span className="highlight">Information</span>
// //               </h2>
// //               <p>
// //                 Send us a message or connect directly with the Connect2Job support team. 
// //                 We are here to help you find the right opportunities.
// //               </p>

// //               {contactInfo.map((item, index) => (
// //                 <div key={index} className="contact-detail-item">
// //                   <div className="icon-box">
// //                     <i className={item.icon} />
// //                   </div>
// //                   <div className="detail-text">
// //                     <h4>{item.label}</h4>
// //                     <p>{item.value}</p>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Contact Form */}
// //             <div className="contact-form-section" data-aos="fade-left" data-aos-duration="800">
// //               <h2>
// //                 Send a <span className="highlight">Message</span>
// //               </h2>
// //               <p className="form-subtitle">Fill out the form below and we'll respond as soon as possible.</p>
              
// //               <form onSubmit={handleSubmit}>
// //                 <div className="form-row">
// //                   <div className="form-group">
// //                     <label>Full Name *</label>
// //                     <input
// //                       type="text"
// //                       name="name"
// //                       placeholder="Enter your full name"
// //                       value={form.name}
// //                       onChange={handleChange}
// //                       required
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label>Email Address *</label>
// //                     <input
// //                       type="email"
// //                       name="email"
// //                       placeholder="Enter your email address"
// //                       value={form.email}
// //                       onChange={handleChange}
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="form-row">
// //                   <div className="form-group">
// //                     <label>Phone Number</label>
// //                     <input
// //                       type="tel"
// //                       name="phone"
// //                       placeholder="Enter your phone number"
// //                       value={form.phone}
// //                       onChange={handleChange}
// //                     />
// //                   </div>
// //                   <div className="form-group">
// //                     <label>Subject</label>
// //                     <input
// //                       type="text"
// //                       name="subject"
// //                       placeholder="Enter subject"
// //                       value={form.subject}
// //                       onChange={handleChange}
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="form-group">
// //                   <label>Message *</label>
// //                   <textarea
// //                     name="message"
// //                     rows="5"
// //                     placeholder="Tell us how we can help..."
// //                     value={form.message}
// //                     onChange={handleChange}
// //                     required
// //                   />
// //                 </div>

// //                 <button 
// //                   type="submit" 
// //                   className="contact-submit-btn"
// //                   disabled={isSubmitting}
// //                 >
// //                   {isSubmitting ? (
// //                     <>
// //                       <i className="fas fa-spinner fa-spin" /> Sending...
// //                     </>
// //                   ) : (
// //                     <>
// //                       <i className="fas fa-paper-plane" /> Send Message
// //                     </>
// //                   )}
// //                 </button>
// //               </form>
// //             </div>
// //           </div>
// //         </div>
// //       </section>
// //     </>
// //   );
// // }

// // src/pages/Contact.jsx
// import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import { useAppContext } from '../context/AppContext';
// import AnimatedBackground from '../components/AnimatedBackground';
// import { contactInfo } from '../data/siteData';
// import { api } from '../services/api';
// import './Contact.css';

// export default function Contact() {
//   // const { showToast, addContact } = useAppContext();
//   const { showToast } = useAppContext();
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ 
//     name: '', 
//     email: '', 
//     phone: '', 
//     subject: '',
//     message: '' 
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     // Validate required fields
//     if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
//       showToast('Please fill in all required fields.', 'error');
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(form.email)) {
//       showToast('Please enter a valid email address.', 'error');
//       return;
//     }

//     setIsSubmitting(true);

//     const contactData = {
//       name: form.name.trim(),
//       email: form.email.trim(),
//       phone: form.phone.trim(),
//       subject: form.subject.trim() || 'General Inquiry',
//       message: form.message.trim(),
//     };

//     try {
//       console.log('📤 Sending contact data:', contactData);
      
//       const response = await api.sendContact(contactData);
//       console.log('✅ Response received:', response);

//       // Save to context/localStorage as backup
//       // addContact(contactData);

//       // Reset form
//       setForm({
//         name: '',
//         email: '',
//         phone: '',
//         subject: '',
//         message: ''
//       });

//       showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
//     } catch (err) {
//       console.error('❌ Error sending contact:', err);
//       showToast('❌ Failed to send message. Please try again later.', 'error');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <>
//       <AnimatedBackground />
//       <section className="contact-page page-section">
//         <div className="container">
//           <div className="page-hero" data-aos="fade-up">
//             <span className="section-badge">Contact Us</span>
//             <h1>
//               Let's Build Your <span className="highlight">Career</span> Together
//             </h1>
//             <p>Reach out for hiring support, job opportunities, or any general inquiries.</p>
//           </div>

//           <div className="contact-wrapper" data-aos="fade-up" data-aos-delay="150">
//             {/* Contact Info */}
//             <div className="contact-info-section" data-aos="fade-right" data-aos-duration="800">
//               <h2>
//                 Need <span className="highlight">Help?</span>
//               </h2>
//               <p>
//                 Our team is available to assist you with career guidance, hiring support, job postings and general inquiries.
//               </p>

//               {contactInfo.map((item, index) => (
//                 <div key={index} className="contact-detail-item">
//                   <div className="icon-box">
//                     <i className={item.icon} />
//                   </div>
//                   <div className="detail-text">
//                     <h4>{item.label}</h4>
//                     <p>{item.value}</p>
//                   </div>
//                 </div>
//               ))}

//               {/* Help Box */}
//               <div className="contact-help-box">
//                 <h3>We can help you with</h3>
//                 <ul>
//                   <li>✔ Finding Jobs</li>
//                   <li>✔ Posting Jobs</li>
//                   <li>✔ Recruitment Support</li>
//                   <li>✔ Technical Assistance</li>
//                 </ul>
//               </div>
//             </div>

//             {/* Contact Form */}
//             <div className="contact-form-section" data-aos="fade-left" data-aos-duration="800">
//               <h2>
//                 Let's Start a <span className="highlight">Conversation</span>
//               </h2>
//               <p className="form-subtitle">
//                 Have a question, need hiring assistance, or want to post a job? We're here to help.
//               </p>
              
//               <form onSubmit={handleSubmit}>
//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Full Name *</label>
//                     <input
//                       type="text"
//                       name="name"
//                       placeholder="Enter your full name"
//                       value={form.name}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Email Address *</label>
//                     <input
//                       type="email"
//                       name="email"
//                       placeholder="Enter your email address"
//                       value={form.email}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="form-row">
//                   <div className="form-group">
//                     <label>Phone Number</label>
//                     <input
//                       type="tel"
//                       name="phone"
//                       placeholder="Enter your phone number"
//                       value={form.phone}
//                       onChange={handleChange}
//                     />
//                   </div>
//                   <div className="form-group">
//                     <label>Subject</label>
//                     <input
//                       type="text"
//                       name="subject"
//                       placeholder="Enter subject"
//                       value={form.subject}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="form-group">
//                   <label>Message *</label>
//                   <textarea
//                     name="message"
//                     rows="5"
//                     placeholder="Tell us how we can help..."
//                     value={form.message}
//                     onChange={handleChange}
//                     required
//                   />
//                 </div>

//                 <button 
//                   type="submit" 
//                   className="contact-submit-btn"
//                   disabled={isSubmitting}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <i className="fas fa-spinner fa-spin" /> Sending...
//                     </>
//                   ) : (
//                     <>
//                       <i className="fas fa-paper-plane" /> Send Message
//                     </>
//                   )}
//                 </button>

//                 {/* OR Divider */}
//                 <div className="or-divider">
//                   <span>OR</span>
//                 </div>

//                 {/* Post a Job Button */}
//                 <button
//                   type="button"
//                   className="post-job-btn"
//                   onClick={() =>
//                     navigate("/jobs", {
//                       state: { openPostJob: true }
//                     })
//                   }
//                 >
//                   💼 Post a Job
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//         <section className="contact-map-section">

//   <h2>Visit Our Office</h2>

//   <p>
//     We'd love to meet you. Find us at our office in Mysuru.
//   </p>

//   <div className="map-container">

//     <iframe
//       title="Connect2Job Location"
//       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.089358270156!2d76.60613771026166!3d12.309768987897812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d5f4a2084adbec9%3A0xf4fcf3522495b959!2sconnect2future!5e0!3m2!1sen!2sin!4v1782841034397!5m2!1sen!2sin"
//       width="100%"
//       height="400"
//       style={{ border: 0 }}
//       loading="lazy"
//       allowFullScreen
//       referrerPolicy="no-referrer-when-downgrade"
//     ></iframe>

//   </div>

// </section>
//       </section>
//     </>
//   );

  
// }

// src/pages/Contact.jsx
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from '../context/AppContext';
import AnimatedBackground from '../components/AnimatedBackground';
import { contactInfo } from '../data/siteData';
import { api } from '../services/api';
import './Contact.css';

export default function Contact() {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    subject: '',
    message: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // ✅ PROTECTED: Check authentication before submitting
    if (!isAuthenticated) {
      showToast("Please login to send a message.", "warning");
      navigate("/login");
      return;
    }
    
    // Validate required fields
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubmitting(true);

    const contactData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      subject: form.subject.trim() || 'General Inquiry',
      message: form.message.trim(),
    };

    try {
      console.log('📤 Sending contact data:', contactData);
      
      const response = await api.sendContact(contactData);
      console.log('✅ Response received:', response);

      // Reset form
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      showToast('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
    } catch (err) {
      console.error('❌ Error sending contact:', err);
      showToast('❌ Failed to send message. Please try again later.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <section className="contact-page page-section">
        <div className="container">
          <div className="page-hero" data-aos="fade-up">
            <span className="section-badge">Contact Us</span>
            <h1>
              Let's Build Your <span className="highlight">Career</span> Together
            </h1>
            <p>Reach out for hiring support, job opportunities, or any general inquiries.</p>
          </div>

          <div className="contact-wrapper" data-aos="fade-up" data-aos-delay="150">
            {/* Contact Info */}
            <div className="contact-info-section" data-aos="fade-right" data-aos-duration="800">
              <h2>
                Need <span className="highlight">Help?</span>
              </h2>
              <p>
                Our team is available to assist you with career guidance, hiring support, job postings and general inquiries.
              </p>

              {contactInfo.map((item, index) => (
                <div key={index} className="contact-detail-item">
                  <div className="icon-box">
                    <i className={item.icon} />
                  </div>
                  <div className="detail-text">
                    <h4>{item.label}</h4>
                    <p>{item.value}</p>
                  </div>
                </div>
              ))}

              {/* Help Box */}
              <div className="contact-help-box">
                <h3>We can help you with</h3>
                <ul>
                  <li>✔ Finding Jobs</li>
                  <li>✔ Posting Jobs</li>
                  <li>✔ Recruitment Support</li>
                  <li>✔ Technical Assistance</li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="contact-form-section" data-aos="fade-left" data-aos-duration="800">
              <h2>
                Let's Start a <span className="highlight">Conversation</span>
              </h2>
              <p className="form-subtitle">
                Have a question, need hiring assistance, or want to post a job? We're here to help.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Enter subject"
                      value={form.subject}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" /> Send Message
                    </>
                  )}
                </button>

                {/* OR Divider */}
                <div className="or-divider">
                  <span>OR</span>
                </div>

                {/* Post a Job Button */}
                <button
                  type="button"
                  className="post-job-btn"
                  onClick={() =>
                    navigate("/jobs", {
                      state: { openPostJob: true }
                    })
                  }
                >
                  💼 Post a Job
                </button>
              </form>
            </div>
          </div>
        </div>
        <section className="contact-map-section">
          <h2>Visit Our Office</h2>
          <p>
            We'd love to meet you. Find us at our office in Mysuru.
          </p>
          <div className="map-container">
            <iframe
              title="Connect2Job Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3898.089358270156!2d76.60613771026166!3d12.309768987897812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8d5f4a2084adbec9%3A0xf4fcf3522495b959!2sconnect2future!5e0!3m2!1sen!2sin!4v1782841034397!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </section>
    </>
  );
}

