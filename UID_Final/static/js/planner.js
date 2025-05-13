// Workout Planner for StrengthWise - 10 Minute Version

document.addEventListener('DOMContentLoaded', function() {
    // Apply template buttons
    const templateButtons = document.querySelectorAll('.apply-template-btn');
    const daySlots = document.querySelectorAll('.day-slot');
    const clearPlanBtn = document.getElementById('clear-plan-btn');
    const savePlanBtn = document.getElementById('save-plan-btn');
    
    // Template data
    const templates = {
        'full-body': {
            monday: 'full-body',
            tuesday: 'rest',
            wednesday: 'full-body',
            thursday: 'rest',
            friday: 'full-body',
            saturday: 'rest',
            sunday: 'rest'
        },
        'upper-lower': {
            monday: 'upper',
            tuesday: 'lower',
            wednesday: 'rest',
            thursday: 'upper',
            friday: 'lower',
            saturday: 'rest',
            sunday: 'rest'
        },
        'ppl': {
            monday: 'push',
            tuesday: 'pull',
            wednesday: 'legs',
            thursday: 'push',
            friday: 'pull',
            saturday: 'legs',
            sunday: 'rest'
        }
    };
    
    // Apply template
    templateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateName = this.getAttribute('data-template');
            applyTemplate(templateName);
            
            // Highlight selected template
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });
            const selectedCard = document.querySelector(`.template-card[data-template="${templateName}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
        });
    });
    
    function applyTemplate(templateName) {
        if (!templates[templateName]) return;
        
        const template = templates[templateName];
        
        // Clear current plan
        clearPlan();
        
        // Apply template to calendar
        Object.keys(template).forEach(day => {
            const workoutType = template[day];
            const dayColumn = document.querySelector(`.day-column[data-day="${day}"]`);
            if (dayColumn) {
                const daySlot = dayColumn.querySelector('.day-slot');
                if (daySlot) {
                    createWorkoutBlock(daySlot, workoutType);
                }
            }
        });
        
        // Update analysis
        updateAnalysis();
    }
    
    // Create workout block
    function createWorkoutBlock(slot, blockType) {
        // Create a new workout block
        const newBlock = document.createElement('div');
        newBlock.className = `workout-block ${blockType}`;
        newBlock.setAttribute('data-block-type', blockType);
        
        // Add appropriate icon and text
        let icon = '';
        let text = '';
        
        switch (blockType) {
            case 'push':
                icon = '<i class="bi bi-box-arrow-right"></i>';
                text = 'Push';
                break;
            case 'pull':
                icon = '<i class="bi bi-box-arrow-left"></i>';
                text = 'Pull';
                break;
            case 'legs':
                icon = '<i class="bi bi-lightning"></i>';
                text = 'Legs';
                break;
            case 'upper':
                icon = '<i class="bi bi-arrow-up-circle"></i>';
                text = 'Upper';
                break;
            case 'lower':
                icon = '<i class="bi bi-arrow-down-circle"></i>';
                text = 'Lower';
                break;
            case 'full-body':
                icon = '<i class="bi bi-person"></i>';
                text = 'Full';
                break;
            case 'rest':
                icon = '<i class="bi bi-battery-charging"></i>';
                text = 'Rest';
                break;
            default:
                icon = '<i class="bi bi-question-circle"></i>';
                text = blockType.charAt(0).toUpperCase() + blockType.slice(1);
        }
        
        newBlock.innerHTML = `${icon} ${text}`;
        
        // Add click to change workout type
        newBlock.addEventListener('click', function() {
            const currentType = this.getAttribute('data-block-type');
            let newType = '';
            
            // Cycle through workout types
            switch (currentType) {
                case 'push': newType = 'pull'; break;
                case 'pull': newType = 'legs'; break;
                case 'legs': newType = 'rest'; break;
                case 'upper': newType = 'lower'; break;
                case 'lower': newType = 'rest'; break;
                case 'full-body': newType = 'rest'; break;
                case 'rest': newType = 'push'; break;
                default: newType = 'push';
            }
            
            // Replace with new block
            createWorkoutBlock(slot, newType);
            
            // Update analysis
            updateAnalysis();
        });
        
        // Clear the slot and add the new block
        slot.innerHTML = '';
        slot.appendChild(newBlock);
    }
    
    // Clear plan
    clearPlanBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear your workout plan?')) {
            clearPlan();
            updateAnalysis();
            
            // Remove template selection
            document.querySelectorAll('.template-card').forEach(card => {
                card.classList.remove('selected');
            });
        }
    });
    
    function clearPlan() {
        daySlots.forEach(slot => {
            slot.innerHTML = '';
        });
    }
    
    // Save plan
    savePlanBtn.addEventListener('click', function() {
        savePlan();
        
        // Show success message
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-white bg-success border-0 show position-fixed bottom-0 end-0 m-3';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-check-circle me-2"></i>
                    Workout plan saved successfully!
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    });
    
    function savePlan() {
        const plan = {};
        const dayColumns = document.querySelectorAll('.day-column');
        
        dayColumns.forEach(column => {
            const day = column.getAttribute('data-day');
            plan[day] = [];
            
            const workoutBlocks = column.querySelectorAll('.workout-block');
            workoutBlocks.forEach(block => {
                plan[day].push({
                    type: block.getAttribute('data-block-type')
                });
            });
        });
        
        // Save to localStorage
        localStorage.setItem('workoutPlan', JSON.stringify(plan));
    }
    
    // Update analysis
    function updateAnalysis() {
        // Count workout types
        const workoutBlocks = document.querySelectorAll('.day-slot .workout-block');
        let trainingDays = 0;
        let restDays = 0;
        
        // Muscle groups trained per workout type
        const musclesPerWorkout = {
            'push': ['chest', 'shoulders', 'triceps'],
            'pull': ['back', 'biceps'],
            'legs': ['quads', 'hamstrings', 'calves'],
            'upper': ['chest', 'back', 'shoulders', 'arms'],
            'lower': ['quads', 'hamstrings', 'calves'],
            'full-body': ['chest', 'back', 'legs', 'shoulders', 'arms']
        };
        
        // Count training and rest days
        workoutBlocks.forEach(block => {
            const blockType = block.getAttribute('data-block-type');
            if (blockType === 'rest') {
                restDays++;
            } else {
                trainingDays++;
            }
        });
        
        // Count muscle frequency
        const muscleFrequency = {
            'chest': 0,
            'back': 0,
            'legs': 0,
            'shoulders': 0,
            'arms': 0
        };
        
        workoutBlocks.forEach(block => {
            const blockType = block.getAttribute('data-block-type');
            if (blockType !== 'rest' && musclesPerWorkout[blockType]) {
                musclesPerWorkout[blockType].forEach(muscle => {
                    if (muscle === 'triceps' || muscle === 'biceps') {
                        muscleFrequency['arms']++;
                    } else if (muscle === 'quads' || muscle === 'hamstrings' || muscle === 'calves') {
                        muscleFrequency['legs']++;
                    } else {
                        muscleFrequency[muscle]++;
                    }
                });
            }
        });
        
        // Calculate average muscle frequency
        let totalFrequency = 0;
        let muscleCount = 0;
        
        for (const muscle in muscleFrequency) {
            totalFrequency += muscleFrequency[muscle];
            muscleCount++;
        }
        
        const avgFrequency = muscleCount > 0 ? Math.round(totalFrequency / muscleCount * 10) / 10 : 0;
        
        // Check recovery status
        let recoveryStatus = 'Good';
        
        // Check if any muscle is trained on consecutive days
        const dayTrainingMap = {};
        
        // Initialize day training map
        for (let i = 0; i < 7; i++) {
            dayTrainingMap[i] = {
                'chest': false,
                'back': false,
                'legs': false,
                'shoulders': false,
                'arms': false
            };
        }
        
        // Fill day training map
        workoutBlocks.forEach((block, index) => {
            const blockType = block.getAttribute('data-block-type');
            const dayColumn = block.closest('.day-column');
            if (dayColumn) {
                const day = dayColumn.getAttribute('data-day');
                const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day);
                
                if (blockType !== 'rest' && musclesPerWorkout[blockType] && dayIndex !== -1) {
                    musclesPerWorkout[blockType].forEach(muscle => {
                        if (muscle === 'triceps' || muscle === 'biceps') {
                            dayTrainingMap[dayIndex]['arms'] = true;
                        } else if (muscle === 'quads' || muscle === 'hamstrings' || muscle === 'calves') {
                            dayTrainingMap[dayIndex]['legs'] = true;
                        } else {
                            dayTrainingMap[dayIndex][muscle] = true;
                        }
                    });
                }
            }
        });
        
        // Check for consecutive training days
        for (const muscle in muscleFrequency) {
            for (let i = 0; i < 6; i++) {
                if (dayTrainingMap[i][muscle] && dayTrainingMap[i+1][muscle]) {
                    recoveryStatus = 'Poor';
                    break;
                }
            }
            // Check wrap-around (Sunday to Monday)
            if (dayTrainingMap[6][muscle] && dayTrainingMap[0][muscle]) {
                recoveryStatus = 'Poor';
            }
        }
        
        // Update analysis display
        const trainingDaysEl = document.getElementById('training-days');
        const restDaysEl = document.getElementById('rest-days');
        const muscleFrequencyEl = document.getElementById('muscle-frequency');
        const recoveryStatusEl = document.getElementById('recovery-status');
        
        if (trainingDaysEl) trainingDaysEl.textContent = `${trainingDays}/7`;
        if (restDaysEl) restDaysEl.textContent = `${restDays}/7`;
        if (muscleFrequencyEl) muscleFrequencyEl.textContent = `${avgFrequency}x/week`;
        
        if (recoveryStatusEl) {
            recoveryStatusEl.textContent = recoveryStatus;
            recoveryStatusEl.className = recoveryStatus === 'Good' ? 'stat-value text-success' : 'stat-value text-danger';
        }
    }
    
    // Load saved plan if exists
    function loadSavedPlan() {
        try {
            const savedPlan = JSON.parse(localStorage.getItem('workoutPlan'));
            
            if (savedPlan) {
                const dayColumns = document.querySelectorAll('.day-column');
                
                dayColumns.forEach(column => {
                    const day = column.getAttribute('data-day');
                    
                    if (savedPlan[day] && savedPlan[day].length > 0) {
                        const slot = column.querySelector('.day-slot');
                        if (slot) {
                            createWorkoutBlock(slot, savedPlan[day][0].type);
                        }
                    }
                });
                
                // Update analysis
                updateAnalysis();
                return true;
            }
        } catch (error) {
            console.error('Error loading saved plan:', error);
        }
        return false;
    }
    
    // Initialize
    const planLoaded = loadSavedPlan();
    
    // If no plan is loaded, apply default template
    if (!planLoaded) {
        applyTemplate('full-body');
    }
});