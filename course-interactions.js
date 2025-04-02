// course-interactions.js
// This file contains functionality to enhance the React course experience

document.addEventListener('DOMContentLoaded', function() {
    // Check if this is the index page
    if (window.isIndexPage) {
        // Only initialize these features on the index page
        initializeCodeHighlighting();
        initializeDarkMode();
        addCopyCodeButtons();
    } else {
        // Initialize all features for content pages
        initializeCollapsibleSections();
        initializeCodeHighlighting();
        initializeProgressTracking();
        initializeDarkMode();
        initializeTableOfContents();
        addCopyCodeButtons();
    }
});

// 1. COLLAPSIBLE SECTIONS
// Makes section content collapsible to help focus on specific topics
function initializeCollapsibleSections() {
	if (window.isIndexPage) return;
    const sectionHeaders = document.querySelectorAll('section > h2');
    
    sectionHeaders.forEach(header => {
        // Add toggle indicator
        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'section-toggle';
        toggleIcon.innerHTML = '−'; // Minus sign to start (expanded)
        header.appendChild(toggleIcon);
        
        // Make headers clickable
        header.style.cursor = 'pointer';
        
        // Set up click handler
        header.addEventListener('click', function() {
            // Find all siblings until the next h2 or end of section
            let currentElement = this.nextElementSibling;
            let isCollapsed = toggleIcon.innerHTML === '+';
            
            // Toggle visibility of all elements until next h2 or end of parent
            while (currentElement && !currentElement.matches('h2')) {
                currentElement.style.display = isCollapsed ? 'block' : 'none';
                currentElement = currentElement.nextElementSibling;
            }
            
            // Update toggle symbol
            toggleIcon.innerHTML = isCollapsed ? '−' : '+';
            
            // Update header appearance
            this.classList.toggle('collapsed', !isCollapsed);
        });
    });
}

// 2. CODE HIGHLIGHTING
// Enhances code blocks with proper syntax highlighting
function initializeCodeHighlighting() {
    // Check if prism.js is already loaded, if not, load it
    if (typeof Prism === 'undefined') {
        // Load Prism CSS
        const prismCSS = document.createElement('link');
        prismCSS.rel = 'stylesheet';
        prismCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/themes/prism.min.css';
        document.head.appendChild(prismCSS);
        
        // Load Prism JS
        const prismScript = document.createElement('script');
        prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/prism.min.js';
        document.head.appendChild(prismScript);
        
        // Load additional React language support
        const prismReact = document.createElement('script');
        prismReact.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.25.0/components/prism-jsx.min.js';
        document.head.appendChild(prismReact);
        
        // Run highlighting after script loads
        prismScript.onload = function() {
            Prism.highlightAll();
        };
    } else {
        // If already loaded, just highlight
        Prism.highlightAll();
    }
}

// 3. PROGRESS TRACKING
// Saves user progress through the course using localStorage
function initializeProgressTracking() {
    // Create progress bar container
	if (window.isIndexPage) return;
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<h3>Course Progress</h3><div class="progress-bar"><div class="progress-fill"></div></div><span class="progress-percentage">0%</span>';
    
    // Add to the DOM after the course title
    const courseTitle = document.querySelector('h1');
    if (courseTitle) {
        courseTitle.after(progressContainer);
    }
    
    // Add completion checkboxes to section headers
    const sections = document.querySelectorAll('section');
    const totalSections = sections.length;
    let completed = 0;
    
    // Get saved progress
    const savedProgress = JSON.parse(localStorage.getItem('reactCourseProgress') || '{}');
    
    sections.forEach((section, index) => {
        const sectionId = section.id || `section-${index}`;
        if (!section.id) section.id = sectionId;
        
        const header = section.querySelector('h2');
        if (header) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'section-complete';
            checkbox.dataset.section = sectionId;
            
            // Check if this section was completed before
            if (savedProgress[sectionId]) {
                checkbox.checked = true;
                completed++;
            }
            
            checkbox.addEventListener('change', function() {
                // Update saved progress
                savedProgress[sectionId] = this.checked;
                localStorage.setItem('reactCourseProgress', JSON.stringify(savedProgress));
                
                // Recalculate progress
                completed = this.checked ? completed + 1 : completed - 1;
                updateProgressBar(completed, totalSections);
            });
            
            header.prepend(checkbox);
        }
    });
    
    // Update progress bar initially
    updateProgressBar(completed, totalSections);
    
    // Helper function to update progress bar
    function updateProgressBar(completed, total) {
        const percentage = Math.round((completed / total) * 100);
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-percentage');
        
        if (progressFill && progressText) {
            progressFill.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}%`;
        }
    }
}

// 4. DARK MODE TOGGLE
// Adds a dark mode option for better reading experience
function initializeDarkMode() {
    // Create toggle button
    const darkModeToggle = document.createElement('button');
    darkModeToggle.id = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙'; // Moon emoji for dark mode
    darkModeToggle.title = 'Toggle Dark Mode';
    
    // Set initial state based on saved preference
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️'; // Sun emoji for light mode
    }
    
    // Add event listener
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        // Save preference
        localStorage.setItem('darkMode', isDark);
        
        // Update button icon
        this.innerHTML = isDark ? '☀️' : '🌙';
    });
    
    // Add button to page
    document.body.prepend(darkModeToggle);
    
    // Add dark mode styles
    const darkModeStyles = document.createElement('style');
    darkModeStyles.textContent = `
        .dark-mode {
            background-color: #1a1a1a !important;
            color: #f0f0f0 !important;
        }
        
        .dark-mode .container {
            background-color: #2a2a2a !important;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5) !important;
        }
        
        .dark-mode h1, .dark-mode h2, .dark-mode h3 {
            color: #fff !important;
        }
        
        .dark-mode .callout {
            background-color: rgba(70, 70, 70, 0.2) !important;
        }
        
        .dark-mode pre {
            background-color: #333 !important;
            border-color: #444 !important;
        }
        
        .dark-mode code {
            color: #f8f8f8 !important;
        }
        
        .dark-mode a {
            color: #61dafb !important;
        }
        
        #dark-mode-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            padding: 8px;
            border-radius: 50%;
            border: none;
            background-color: var(--bg-color);
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            font-size: 18px;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .dark-mode #dark-mode-toggle {
            background-color: #444;
        }
        
        /* Progress tracking styles */
        .progress-container {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .dark-mode .progress-container {
            background-color: #333;
        }
        
        .progress-bar {
            height: 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            overflow: hidden;
            margin: 10px 0;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--primary-color);
            width: 0%;
            transition: width 0.5s ease;
        }
        
        .section-complete {
            margin-right: 10px;
        }
        
        /* Table of contents styles */
        .toc-container {
            margin: 20px 0;
            padding: 15px;
            background-color: var(--card-bg);
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        
        .dark-mode .toc-container {
            background-color: #333;
        }
        
        .toc-list {
            list-style-type: none;
            padding-left: 0;
        }
        
        .toc-list li {
            margin-bottom: 8px;
        }
        
        .toc-list a {
            text-decoration: none;
            color: var(--text-color);
            display: block;
            padding: 5px;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .toc-list a:hover {
            background-color: var(--hover-color);
        }
        
        .dark-mode .toc-list a {
            color: #f0f0f0;
        }
        
        .dark-mode .toc-list a:hover {
            background-color: #444;
        }
        
        /* Section toggle styles */
        .section-toggle {
            margin-left: 10px;
            font-size: 20px;
            display: inline-block;
            width: 20px;
            text-align: center;
            transition: transform 0.3s;
        }
        
        h2.collapsed {
            margin-bottom: 30px;
            border-bottom-color: transparent;
        }
        
        /* Copy code button styles */
        .code-block-container {
            position: relative;
        }
        
        .copy-button {
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 5px 8px;
            background-color: rgba(0, 0, 0, 0.1);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        
        .copy-button:hover {
            opacity: 1;
        }
        
        .dark-mode .copy-button {
            background-color: rgba(255, 255, 255, 0.1);
            color: #f0f0f0;
        }
    `;
    
    document.head.appendChild(darkModeStyles);
}

// 5. TABLE OF CONTENTS
// Creates a floating or sidebar TOC for easy navigation
function initializeTableOfContents() {
	if (window.isIndexPage) return;
    // Create TOC container
    const tocContainer = document.createElement('div');
    tocContainer.className = 'toc-container';
    tocContainer.innerHTML = '<h3>Table of Contents</h3>';
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    // Get all section headers
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        const header = section.querySelector('h2');
        
        if (header) {
            const sectionId = section.id || `section-${index}`;
            if (!section.id) section.id = sectionId;
            
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            
            link.href = `#${sectionId}`;
            link.textContent = header.textContent.replace('−', '').replace('+', '').trim();
            
            listItem.appendChild(link);
            tocList.appendChild(listItem);
        }
    });
    
    tocContainer.appendChild(tocList);
    
    // Add TOC after the course title and progress bar
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.after(tocContainer);
    } else {
        const courseTitle = document.querySelector('h1');
        if (courseTitle) {
            courseTitle.after(tocContainer);
        }
    }
}

// 6. COPY CODE BUTTONS
// Adds copy buttons to code blocks
function addCopyCodeButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach(block => {
        // Create container for positioning
        const container = document.createElement('div');
        container.className = 'code-block-container';
        
        // Move pre into container
        block.parentNode.insertBefore(container, block);
        container.appendChild(block);
        
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        
        copyButton.addEventListener('click', function() {
            const code = block.querySelector('code') || block;
            const textToCopy = code.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(
                function() {
                    // Success feedback
                    copyButton.textContent = 'Copied!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                },
                function() {
                    // Error feedback
                    copyButton.textContent = 'Failed!';
                    setTimeout(() => {
                        copyButton.textContent = 'Copy';
                    }, 2000);
                }
            );
        });
        
        container.appendChild(copyButton);
    });
}

// 7. INTERACTIVE EXAMPLES (Basic Implementation)
// Creates live editable React examples
function initializeInteractiveExamples() {
    // This requires React, React DOM, and Babel to be properly set up
    // This is a simplified version - a full implementation would need more setup
    
    const interactiveExamples = document.querySelectorAll('.interactive-example');
    
    interactiveExamples.forEach((example, index) => {
        // Create container structure
        const container = document.createElement('div');
        container.className = 'interactive-container';
        example.parentNode.insertBefore(container, example);
        
        // Create editor
        const editor = document.createElement('div');
        editor.className = 'code-editor';
        
        const editorTextarea = document.createElement('textarea');
        editorTextarea.id = `editor-${index}`;
        editorTextarea.value = example.textContent;
        editor.appendChild(editorTextarea);
        
        // Create preview area
        const preview = document.createElement('div');
        preview.className = 'preview-area';
        preview.id = `preview-${index}`;
        
        // Create run button
        const runButton = document.createElement('button');
        runButton.textContent = 'Run Code';
        runButton.className = 'run-button';
        
        // Add elements to container
        container.appendChild(editor);
        container.appendChild(runButton);
        container.appendChild(preview);
        
        // Remove original element
        example.remove();
        
        // This is where you would set up the actual React rendering
        // This requires React, ReactDOM, and Babel to be loaded
        // For a full implementation, consider using a library like CodeMirror
    });
}