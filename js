// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(102, 126, 234, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all elements with fade-in class
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Add fade-in class to cards on page load
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.feature-card, .topic-card, .writing-card');
    cards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// Quiz functionality
class Quiz {
    constructor(container) {
        this.container = container;
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.answered = false;
    }

    addQuestion(question, options, correctAnswer, explanation = '') {
        this.questions.push({
            question,
            options,
            correctAnswer,
            explanation
        });
    }

    render() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestion];
        this.container.innerHTML = `
            <div class="quiz-header">
                <h3>Question ${this.currentQuestion + 1} of ${this.questions.length}</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${(this.currentQuestion / this.questions.length) * 100}%"></div>
                </div>
            </div>
            <div class="question">
                <h4>${question.question}</h4>
                <div class="options">
                    ${question.options.map((option, index) => `
                        <div class="option" data-index="${index}">${option}</div>
                    `).join('')}
                </div>
            </div>
            <div class="quiz-controls">
                <button class="btn btn-primary" id="next-btn" disabled>Next Question</button>
            </div>
            <div class="explanation" id="explanation" style="display: none;"></div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const options = this.container.querySelectorAll('.option');
        const nextBtn = this.container.querySelector('#next-btn');
        const explanation = this.container.querySelector('#explanation');

        options.forEach(option => {
            option.addEventListener('click', () => {
                if (this.answered) return;

                const selectedIndex = parseInt(option.dataset.index);
                const question = this.questions[this.currentQuestion];

                options.forEach((opt, index) => {
                    opt.classList.remove('selected');
                    if (index === question.correctAnswer) {
                        opt.classList.add('correct');
                    } else if (index === selectedIndex && index !== question.correctAnswer) {
                        opt.classList.add('incorrect');
                    }
                });

                if (selectedIndex === question.correctAnswer) {
                    this.score++;
                }

                if (question.explanation) {
                    explanation.innerHTML = `<strong>Explanation:</strong> ${question.explanation}`;
                    explanation.style.display = 'block';
                }

                this.answered = true;
                nextBtn.disabled = false;
            });
        });

        nextBtn.addEventListener('click', () => {
            this.currentQuestion++;
            this.answered = false;
            this.render();
        });
    }

    showResults() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        let message = '';
        
        if (percentage >= 80) {
            message = 'Excellent! You have a great understanding of the topic.';
        } else if (percentage >= 60) {
            message = 'Good job! You have a solid grasp of the concepts.';
        } else if (percentage >= 40) {
            message = 'Not bad, but you might want to review the material.';
        } else {
            message = 'You should study this topic more carefully.';
        }

        this.container.innerHTML = `
            <div class="quiz-results">
                <h3>Quiz Complete!</h3>
                <div class="score-circle">
                    <div class="score">${percentage}%</div>
                </div>
                <p>You scored ${this.score} out of ${this.questions.length} questions correctly.</p>
                <p class="result-message">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Retake Quiz</button>
            </div>
        `;
    }
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchResults = document.querySelector('#search-results');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.innerHTML = '';
            return;
        }

        // Simple search implementation
        const searchableContent = [
            { title: 'Articles', url: 'pages/articles.html', description: 'Learn about a, an, the' },
            { title: 'Prepositions', url: 'pages/prepositions.html', description: 'Master preposition usage' },
            { title: 'Verb Forms', url: 'pages/verb-forms.html', description: 'Right form of verbs' },
            { title: 'Transformation', url: 'pages/transformation.html', description: 'Sentence transformation' },
            { title: 'Narration', url: 'pages/narration.html', description: 'Direct and indirect speech' },
            { title: 'Paragraphs', url: 'pages/paragraphs.html', description: 'Paragraph writing' },
            { title: 'Compositions', url: 'pages/compositions.html', description: 'Essay writing' }
        ];

        const results = searchableContent.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.description.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result">
                    <a href="${result.url}">
                        <h4>${result.title}</h4>
                        <p>${result.description}</p>
                    </a>
                </div>
            `).join('');
        } else {
            searchResults.innerHTML = '<div class="no-results">No results found</div>';
        }
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);

// Back to top button
const backToTopButton = document.createElement('button');
backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopButton.className = 'back-to-top';
backToTopButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    font-size: 1.2rem;
`;

document.body.appendChild(backToTopButton);

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.style.opacity = '1';
        backToTopButton.style.visibility = 'visible';
    } else {
        backToTopButton.style.opacity = '0';
        backToTopButton.style.visibility = 'hidden';
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Print functionality
function printPage() {
    window.print();
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 2rem;
    }
    
    .progress {
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        transition: width 0.3s ease;
    }
    
    .quiz-results {
        text-align: center;
        padding: 2rem;
    }
    
    .score-circle {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 2rem auto;
    }
    
    .score {
        font-size: 2rem;
        font-weight: bold;
        color: white;
    }
    
    .result-message {
        font-size: 1.1rem;
        margin: 1rem 0;
        color: #666;
    }
`;

document.head.appendChild(notificationStyles);

