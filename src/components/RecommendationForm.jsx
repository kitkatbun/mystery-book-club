import { useState } from 'react';

function RecommendationForm() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    platform: '',
    type: 'book',
    customType: '',
    recommendedBy: '',
    reason: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Google Form configuration
    const formId = '1FAIpQLSfMm5bNpJ8Q6cdSquPywZVde9rFWJT9ojcI1UPnq4iY2JiTFA';
    const baseUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;

    // Map form type to Google Form type labels
    const typeLabels = {
      book: 'Book',
      tv: 'TV Show',
      movie: 'Movie',
      other: 'Other'
    };

    // Build form data for submission
    const params = new URLSearchParams({
      'entry.295141657': formData.title,
      'entry.80373613': typeLabels[formData.type],
      'entry.399852401': formData.author,
      'entry.1841472380': formData.platform,
      'entry.503384856': formData.customType,
      'entry.1888577507': formData.recommendedBy,
      'entry.1417193593': formData.reason
    });

    // Submit via hidden iframe to avoid CORS issues
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'hidden_iframe';
    document.body.appendChild(iframe);

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = baseUrl;
    form.target = 'hidden_iframe';

    params.forEach((value, key) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(form);
      document.body.removeChild(iframe);
    }, 1000);

    setSubmitted(true);
    setFormData({
      title: '',
      author: '',
      platform: '',
      type: 'book',
      customType: '',
      recommendedBy: '',
      reason: ''
    });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const typeLabels = {
    book: 'Book',
    tv: 'TV Show',
    movie: 'Movie',
    other: 'Other'
  };

  const isBook = formData.type === 'book';
  const isOther = formData.type === 'other';
  const platformPlaceholder = formData.type === 'movie' ? 'Netflix, Max, Theaters...' :
                              formData.type === 'tv' ? 'Netflix, Hulu, Max...' : 'Where can we find it?';

  return (
    <div className="recommendation-form-container">
      <h2>Add a Recommendation</h2>
      <p className="form-subtitle">Share something you think the club would enjoy!</p>

      {submitted && (
        <div className="form-success">
          Thanks for your recommendation! It will be reviewed soon.
        </div>
      )}

      <form onSubmit={handleSubmit} className="recommendation-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="What are you recommending?"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          {isBook ? (
            <div className="form-group">
              <label htmlFor="author">Author</label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Who wrote it?"
                required
              />
            </div>
          ) : isOther ? (
            <div className="form-group">
              <label htmlFor="customType">What Type?</label>
              <input
                type="text"
                id="customType"
                name="customType"
                value={formData.customType}
                onChange={handleChange}
                placeholder="Podcast, Game, Play..."
                required
              />
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="platform">Where to Watch</label>
              <input
                type="text"
                id="platform"
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                placeholder={platformPlaceholder}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="recommendedBy">Your Name</label>
            <input
              type="text"
              id="recommendedBy"
              name="recommendedBy"
              value={formData.recommendedBy}
              onChange={handleChange}
              placeholder="Who's recommending this?"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Why do you recommend it?</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            placeholder="Tell us what makes this worth checking out..."
            rows={3}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Submit Recommendation
        </button>
      </form>
    </div>
  );
}

export default RecommendationForm;
