import emailjs from 'emailjs-com';

const handleSubmit = (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  emailjs.sendForm(
    'your_service_id',     // from EmailJS dashboard
    'your_template_id',    // the template you configured
    e.target,              // the form element
    'your_public_key'      // from EmailJS account
  )
  .then(() => {
    alert('Inquiry submitted successfully!');
    setFormData({
      serviceName: '',
      contactPerson: '',
      phone: '',
      email: '',
      city: ''
    });
  })
  .catch((error) => {
    console.error('EmailJS Error:', error);
    alert('Failed to send inquiry. Please try again.');
  })
  .finally(() => setIsSubmitting(false));
};

