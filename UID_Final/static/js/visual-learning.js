// Visual Learning Interactions for StrengthWise

document.addEventListener('DOMContentLoaded', function() {
    // Frequency selector
    initFrequencySelector();
    
    // Recovery Timeline Interactions
    initRecoveryTimeline();
    
    // Muscle Map Interactions
    initMuscleMap();
    
    // Split Types Interactions
    initSplitTypes();
    
    // Checklist functionality
    initChecklist();
    
    // Initialize interaction prompts
    initInteractionPrompts();
});

// Handle interaction prompts
function initInteractionPrompts() {
    // Get all interaction prompts
    const interactionPrompts = document.querySelectorAll('.interaction-prompt');
    
    if (!interactionPrompts.length) return;
    
    // Add visual highlight to all interaction prompts
    interactionPrompts.forEach(prompt => {
        // Add persistent highlight class instead of removing the prompts
        prompt.classList.add('persistent-prompt');
    });
}

// Frequency Selector
function initFrequencySelector() {
    const frequencyOptions = document.querySelectorAll('.frequency-option');
    if (!frequencyOptions.length) return;
    
    frequencyOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            frequencyOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show corresponding info
            const frequency = this.getAttribute('data-frequency');
            document.querySelectorAll('.frequency-detail').forEach(detail => {
                detail.style.display = 'none';
            });
            document.getElementById(`frequency-${frequency}`).style.display = 'block';
        });
    });
}

// Recovery Timeline Functions
function initRecoveryTimeline() {
    const timelineTabs = document.querySelectorAll('.timeline-tab');
    const phaseInfos = document.querySelectorAll('.phase-info');
    
    if (!timelineTabs.length) return;
    
    timelineTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            timelineTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding phase info
            const phase = this.getAttribute('data-phase');
            phaseInfos.forEach(info => {
                info.classList.remove('active');
            });
            document.getElementById(`${phase}-info`).classList.add('active');
            
            // Animate the waves based on the selected phase
            animateWaves(phase);
        });
    });
    
    // Initial wave animation
    animateWaves('protein-synthesis');
    
    // Animate protein synthesis and soreness waves
    function animateWaves(phase) {
        const proteinWave = document.querySelector('.protein-path');
        const sorenessWave = document.querySelector('.soreness-path');
        
        if (!proteinWave || !sorenessWave) return;
        
        // Reset animations
        proteinWave.classList.remove('animate');
        sorenessWave.classList.remove('animate');
        
        // Set wave paths based on the phase
        setTimeout(() => {
            if (phase === 'protein-synthesis') {
                proteinWave.setAttribute('d', 'M0,100 C150,160 350,40 500,100 C650,160 850,40 1000,100 C1150,160 1200,100 1200,100 L1200,200 L0,200 Z');
                sorenessWave.setAttribute('d', 'M0,100 C150,40 350,160 500,100 C650,40 850,160 1000,100 C1150,40 1200,100 1200,100 L1200,200 L0,200 Z');
            } else if (phase === 'peak-synthesis') {
                proteinWave.setAttribute('d', 'M0,100 C150,40 350,20 500,40 C650,60 850,20 1000,60 C1150,100 1200,100 1200,100 L1200,200 L0,200 Z');
                sorenessWave.setAttribute('d', 'M0,100 C150,160 350,180 500,160 C650,140 850,180 1000,140 C1150,100 1200,100 1200,100 L1200,200 L0,200 Z');
            } else if (phase === 'recovery-complete') {
                proteinWave.setAttribute('d', 'M0,100 C150,100 350,100 500,100 C650,100 850,100 1000,100 C1150,100 1200,100 1200,100 L1200,200 L0,200 Z');
                sorenessWave.setAttribute('d', 'M0,100 C150,100 350,100 500,100 C650,100 850,100 1000,100 C1150,100 1200,100 1200,100 L1200,200 L0,200 Z');
            }
            
            // Add animation class
            proteinWave.classList.add('animate');
            sorenessWave.classList.add('animate');
        }, 50);
    }
}

// Muscle Map Functions
function initMuscleMap() {
    const bodyParts = document.querySelectorAll('.body-part:not(.non-interactive)');
    const rotateButton = document.getElementById('rotate-muscle-map');
    let isBackView = false;
    
    if (!bodyParts.length || !rotateButton) return;
    
    // Handle body part clicks
    bodyParts.forEach(part => {
        part.addEventListener('click', function() {
            // Remove active class from all parts
            bodyParts.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked part
            this.classList.add('active');
            
            // Update muscle info
            updateMuscleInfo(this);
        });
    });
    
    // Handle rotate button click
    rotateButton.addEventListener('click', function() {
        isBackView = !isBackView;
        
        // Toggle front/back view for regular body parts
        document.querySelectorAll('.body-part:not(.back-view):not(.non-interactive)').forEach(part => {
            part.style.display = isBackView ? 'none' : 'block';
        });
        
        document.querySelectorAll('.body-part.back-view:not(.non-interactive)').forEach(part => {
            part.style.display = isBackView ? 'block' : 'none';
        });
        
        // Toggle front/back view for non-interactive parts
        document.querySelectorAll('.body-part.non-interactive:not(.back-view)').forEach(part => {
            part.style.display = isBackView ? 'none' : 'block';
        });
        
        document.querySelectorAll('.body-part.non-interactive.back-view').forEach(part => {
            part.style.display = isBackView ? 'block' : 'none';
        });
        
        // Rotate the button icon
        this.style.transform = isBackView ? 'rotate(180deg)' : 'rotate(0deg)';
        
        // Reset active state and info
        bodyParts.forEach(p => p.classList.remove('active'));
        resetMuscleInfo();
    });
    
    // Update muscle information panel
    function updateMuscleInfo(part) {
        const muscleName = part.getAttribute('data-part');
        const recoveryTime = part.getAttribute('data-recovery');
        const muscleInfo = part.getAttribute('data-info');
        
        // Update panel content
        document.getElementById('muscle-name').textContent = formatMuscleName(muscleName);
        document.getElementById('recovery-time').textContent = `Recovery: ${recoveryTime} hours`;
        document.getElementById('muscle-description').textContent = muscleInfo;
        
        // Set recovery factors based on muscle group
        setRecoveryFactors(muscleName);
        
        // Update training tips
        updateTrainingTips(muscleName);
    }
    
    // Reset muscle info to default state
    function resetMuscleInfo() {
        document.getElementById('muscle-name').textContent = 'Select a muscle group';
        document.getElementById('recovery-time').textContent = 'Recovery: 24-48 hours';
        document.getElementById('muscle-description').textContent = 'Click on a muscle group to see detailed recovery information.';
        
        // Reset factors
        document.getElementById('sleep-factor').style.width = '0%';
        document.getElementById('nutrition-factor').style.width = '0%';
        document.getElementById('intensity-factor').style.width = '0%';
        
        // Reset tips
        document.getElementById('muscle-tips').innerHTML = `
            <h6>Training Tips</h6>
            <ul>
                <li>Select a muscle group to see specific training tips</li>
            </ul>
        `;
    }
    
    // Format muscle name for display
    function formatMuscleName(name) {
        return name.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    // Set recovery factors based on muscle group
    function setRecoveryFactors(muscleName) {
        let sleepFactor, nutritionFactor, intensityFactor;
        
        switch(muscleName) {
            case 'chest':
            case 'back':
                sleepFactor = '90%';
                nutritionFactor = '85%';
                intensityFactor = '80%';
                break;
            case 'legs':
            case 'quads':
            case 'hamstrings':
                sleepFactor = '95%';
                nutritionFactor = '90%';
                intensityFactor = '85%';
                break;
            case 'shoulders':
            case 'traps':
                sleepFactor = '85%';
                nutritionFactor = '80%';
                intensityFactor = '75%';
                break;
            case 'biceps':
            case 'triceps':
            case 'arms':
                sleepFactor = '75%';
                nutritionFactor = '80%';
                intensityFactor = '70%';
                break;
            case 'abs':
            case 'calves':
                sleepFactor = '70%';
                nutritionFactor = '75%';
                intensityFactor = '65%';
                break;
            default:
                sleepFactor = '80%';
                nutritionFactor = '80%';
                intensityFactor = '75%';
        }
        
        // Animate the factor meters
        document.getElementById('sleep-factor').style.width = sleepFactor;
        document.getElementById('nutrition-factor').style.width = nutritionFactor;
        document.getElementById('intensity-factor').style.width = intensityFactor;
    }
    
    // Update training tips based on muscle group
    function updateTrainingTips(muscleName) {
        let tips = '';
        
        switch(muscleName) {
            case 'chest':
                tips = `
                    <h6>Chest Training Tips</h6>
                    <ul>
                        <li>Include both pressing and fly movements</li>
                        <li>Vary angles (incline, flat, decline) for complete development</li>
                        <li>Focus on full range of motion</li>
                    </ul>
                `;
                break;
            case 'back':
                tips = `
                    <h6>Back Training Tips</h6>
                    <ul>
                        <li>Include both vertical (pull-ups) and horizontal (rows) pulling</li>
                        <li>Focus on scapular retraction</li>
                        <li>Use a variety of grips (wide, narrow, neutral)</li>
                    </ul>
                `;
                break;
            case 'shoulders':
            case 'traps':
                tips = `
                    <h6>Shoulder Training Tips</h6>
                    <ul>
                        <li>Train all three deltoid heads (front, side, rear)</li>
                        <li>Include both pressing and raising movements</li>
                        <li>Be cautious with heavy overhead pressing</li>
                    </ul>
                `;
                break;
            case 'legs':
            case 'quads':
            case 'hamstrings':
                tips = `
                    <h6>Leg Training Tips</h6>
                    <ul>
                        <li>Include both knee-dominant (squats) and hip-dominant (deadlifts) exercises</li>
                        <li>Train through full range of motion</li>
                        <li>Allow adequate recovery (72-96 hours)</li>
                    </ul>
                `;
                break;
            case 'biceps':
            case 'triceps':
            case 'arms':
                tips = `
                    <h6>Arm Training Tips</h6>
                    <ul>
                        <li>Arms get indirect work from compound movements</li>
                        <li>Use a variety of exercises for complete development</li>
                        <li>Focus on mind-muscle connection</li>
                    </ul>
                `;
                break;
            case 'abs':
                tips = `
                    <h6>Abs Training Tips</h6>
                    <ul>
                        <li>Train with resistance for growth</li>
                        <li>Include both flexion and stabilization exercises</li>
                        <li>Can be trained more frequently (2-4x per week)</li>
                    </ul>
                `;
                break;
            case 'calves':
                tips = `
                    <h6>Calves Training Tips</h6>
                    <ul>
                        <li>Train through full range of motion</li>
                        <li>Include both seated and standing variations</li>
                        <li>Higher volume often needed (12-20 reps)</li>
                    </ul>
                `;
                break;
            default:
                tips = `
                    <h6>Training Tips</h6>
                    <ul>
                        <li>Focus on compound movements</li>
                        <li>Train with proper form and technique</li>
                        <li>Allow adequate recovery between sessions</li>
                    </ul>
                `;
        }
        
        document.getElementById('muscle-tips').innerHTML = tips;
    }
}

// Split Types Functions
function initSplitTypes() {
    const splitCards = document.querySelectorAll('.split-type-card');
    const splitCalendars = document.querySelectorAll('.split-calendar');
    
    if (!splitCards.length) return;
    
    splitCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Remove active class from all cards
            splitCards.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked card
            this.classList.add('active');
            
            // Update the calendar view
            const splitType = this.getAttribute('data-split');
            updateCalendar(splitType);
        });
    });
    
    // Update calendar based on selected split
    function updateCalendar(splitType) {
        splitCalendars.forEach(calendar => calendar.classList.remove('active'));
        
        if (splitType === 'full-body') {
            document.getElementById('full-body-calendar').classList.add('active');
        } else if (splitType === 'upper-lower') {
            document.getElementById('upper-lower-calendar').classList.add('active');
        } else if (splitType === 'ppl') {
            document.getElementById('ppl-calendar').classList.add('active');
        }
    }
    
    // Split Builder
    const dayButtons = document.querySelectorAll('.day-btn');
    const levelButtons = document.querySelectorAll('.level-btn');
    const goalButtons = document.querySelectorAll('.goal-btn');
    const applyButton = document.getElementById('apply-split');
    
    if (!dayButtons.length || !levelButtons.length || !goalButtons.length) return;
    
    // Handle day button clicks
    dayButtons.forEach(button => {
        button.addEventListener('click', function() {
            dayButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateRecommendation();
        });
    });
    
    // Handle level button clicks
    levelButtons.forEach(button => {
        button.addEventListener('click', function() {
            levelButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateRecommendation();
        });
    });
    
    // Handle goal button clicks
    goalButtons.forEach(button => {
        button.addEventListener('click', function() {
            goalButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            updateRecommendation();
        });
    });
    
    // Update split recommendation based on selections
    function updateRecommendation() {
        const days = document.querySelector('.day-btn.active').getAttribute('data-days');
        const level = document.querySelector('.level-btn.active').getAttribute('data-level');
        const goal = document.querySelector('.goal-btn.active').getAttribute('data-goal');
        
        let recommendation = '';
        let frequency = '';
        
        // Determine recommendation based on selections
        if (days <= 3) {
            recommendation = 'Full Body Split';
            frequency = '3x/week';
            updateChartBars('75%');
        } else if (days <= 4) {
            recommendation = 'Upper/Lower Split';
            frequency = '2x/week';
            updateChartBars('50%');
        } else {
            recommendation = 'Push/Pull/Legs Split';
            frequency = '2x/week';
            updateChartBars('50%');
        }
        
        // Update recommendation display
        document.getElementById('split-recommendation').textContent = recommendation;
        
        // Update recommendation details
        const details = document.querySelector('.result-details p');
        details.innerHTML = `Based on your selections, we recommend a <strong>${recommendation}</strong> with ${days} training days per week. This provides optimal frequency and recovery for your experience level and goals.`;
    }
    
    // Update chart bars
    function updateChartBars(width) {
        const barFills = document.querySelectorAll('.bar-fill');
        barFills.forEach(bar => {
            bar.style.width = width;
            bar.textContent = width === '75%' ? '3x/week' : '2x/week';
        });
    }
    
    // Apply button click
    if (applyButton) {
        applyButton.addEventListener('click', function() {
            const recommendation = document.getElementById('split-recommendation').textContent;
            alert(`${recommendation} has been applied to your training plan!`);
        });
    }
}

// Checklist Functions
function initChecklist() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    const resultBox = document.getElementById('checklist-result');
    
    if (!checkboxes.length || !resultBox) return;
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Count checked items
            const checkedCount = document.querySelectorAll('.form-check-input:checked').length;
            
            // Show result if all are checked
            if (checkedCount === checkboxes.length) {
                resultBox.classList.remove('d-none');
            } else {
                resultBox.classList.add('d-none');
            }
        });
    });
}