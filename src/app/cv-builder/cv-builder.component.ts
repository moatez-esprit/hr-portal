import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

interface Suggestion {
  field: string;
  tip: string;
  examples?: string[];
  dynamicTips?: string[];
}

@Component({
  selector: 'app-cv-builder',
  templateUrl: './cv-builder.component.html',
  styleUrls: ['./cv-builder.component.css']
})
export class CvBuilderComponent implements OnInit {
  cvForm: FormGroup;
  focusedField: string = '';
  activeSuggestion: Suggestion | null = null;
  showPreview: boolean = true;

  private suggestionDatabase: { [key: string]: Suggestion } = {
    fullName: {
      field: 'fullName',
      tip: 'Use your full legal name as it appears on official documents. Avoid nicknames unless professionally known by them.',
      examples: ['John Michael Smith', 'Sarah Elizabeth Johnson', 'Dr. Michael Chen']
    },
    email: {
      field: 'email',
      tip: 'Use a professional email address. Avoid unprofessional usernames. Consider creating a dedicated email for job applications.',
      dynamicTips: [
        'Gmail and Outlook are widely accepted professional email providers',
        'Include your name in the email address when possible',
        'Avoid numbers unless necessary (birth year, etc.)'
      ]
    },
    phone: {
      field: 'phone',
      tip: 'Include your country code for international applications. Ensure your voicemail is professional.',
      dynamicTips: [
        'Format: +1 (555) 123-4567 for US numbers',
        'Use a phone number where you can be easily reached',
        'Consider getting a Google Voice number for job searching'
      ]
    },
    address: {
      field: 'address',
      tip: 'Include city, state/province, and country. You may omit street address for privacy. Consider including if the job requires local candidates.',
      examples: ['New York, NY, USA', 'London, UK', 'Toronto, ON, Canada']
    },
    summary: {
      field: 'summary',
      tip: 'Write a compelling 2-3 sentence summary highlighting your key strengths, experience, and career goals. Use action words and quantify achievements when possible.',
      examples: [
        'Results-driven software engineer with 5+ years of experience developing scalable web applications. Proven track record of leading cross-functional teams and delivering projects 20% ahead of schedule.',
        'Creative marketing professional with expertise in digital campaigns and brand strategy. Increased social media engagement by 150% and generated $2M in revenue through innovative marketing initiatives.',
        'Experienced project manager with PMP certification and 8+ years managing complex IT projects. Successfully delivered 50+ projects on time and under budget, with expertise in Agile methodologies.'
      ]
    },
    company: {
      field: 'company',
      tip: 'Include the full company name. If it\'s not well-known, add a brief description in parentheses.',
      dynamicTips: [
        'Use the official company name as it appears on their website',
        'For startups or small companies, consider adding industry context',
        'If the company has changed names, use the name during your employment'
      ]
    },
    position: {
      field: 'position',
      tip: 'Use your official job title. If it\'t doesn\'t clearly describe your role, add clarification in parentheses.',
      examples: [
        'Senior Software Engineer', 'Marketing Manager', 'Business Analyst',
        'Full Stack Developer', 'Product Manager', 'Data Scientist',
        'UX/UI Designer', 'Sales Representative', 'Operations Manager'
      ]
    },
    description: {
      field: 'description',
      tip: 'Use bullet points with strong action verbs. Quantify achievements with numbers, percentages, or dollar amounts. Focus on results and impact.',
      examples: [
        '• Developed and maintained 15+ web applications using React and Node.js',
        '• Led a team of 8 developers to deliver projects 25% faster than industry average',
        '• Increased customer satisfaction scores by 40% through process improvements',
        '• Managed a budget of $2M and reduced operational costs by 15%',
        '• Implemented automated testing procedures, reducing bugs by 60%',
        '• Collaborated with cross-functional teams to launch 3 major product features'
      ]
    },
    institution: {
      field: 'institution',
      tip: 'Include the full name of the educational institution. Add location if it helps with recognition.',
      dynamicTips: [
        'Use the official name of the university or college',
        'Include \"University\" or \"College\" in the name for clarity',
        'For international institutions, consider adding the country'
      ]
    },
    degree: {
      field: 'degree',
      tip: 'Include degree type, major, and relevant details like GPA (if 3.5+), honors, or relevant coursework.',
      examples: [
        'Bachelor of Science in Computer Science',
        'Master of Business Administration (MBA)',
        'Bachelor of Arts in Marketing, Magna Cum Laude',
        'Associate Degree in Web Development',
        'Certificate in Data Analytics'
      ]
    },
    skill: {
      field: 'skill',
      tip: 'List specific, relevant skills. Group similar skills together. Include both technical and soft skills.',
      examples: [
        'JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'AWS',
        'Project Management', 'Leadership', 'Communication', 'Problem Solving',
        'Adobe Creative Suite', 'Google Analytics', 'Salesforce', 'Excel'
      ]
    }
  };

  constructor(private fb: FormBuilder) {
    this.cvForm = this.fb.group({
      personalInfo: this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['']
      }),
      summary: [''],
      experience: this.fb.array([]),
      education: this.fb.array([]),
      skills: this.fb.array([])
    });
  }

  ngOnInit() {
    // Initialize with one experience and education entry
    this.addExperience();
    this.addEducation();
    this.addSkill();
  }

  get experience(): FormArray {
    return this.cvForm.get('experience') as FormArray;
  }

  get education(): FormArray {
    return this.cvForm.get('education') as FormArray;
  }

  get skills(): FormArray {
    return this.cvForm.get('skills') as FormArray;
  }

  onFieldFocus(fieldName: string) {
    this.focusedField = fieldName;
    this.showSuggestion(fieldName);
  }

  onFieldBlur() {
    setTimeout(() => {
      this.focusedField = '';
      this.activeSuggestion = null;
    }, 200); // Delay to allow clicking on suggestions
  }

  onFieldInput(fieldType: string, event: any) {
    const value = event.target.value;
    this.updateDynamicSuggestion(fieldType, value);
  }

  showSuggestion(fieldName: string) {
    const baseField = fieldName.split('-')[0]; // Remove index for array fields
    const suggestion = this.suggestionDatabase[baseField];

    if (suggestion) {
      this.activeSuggestion = {
        ...suggestion,
        field: fieldName
      };
    }
  }

  updateDynamicSuggestion(fieldType: string, value: string) {
    if (!this.activeSuggestion) return;

    const suggestion = this.suggestionDatabase[fieldType];
    if (suggestion?.dynamicTips) {
      // Update tip based on input value
      if (fieldType === 'email' && value.includes('@')) {
        const domain = value.split('@')[1];
        if (domain && !['gmail.com', 'outlook.com', 'yahoo.com'].includes(domain)) {
          this.activeSuggestion.tip = 'Consider using a more widely recognized email provider for better deliverability.';
        }
      }
    }
  }

  applySuggestion(fieldName: string, suggestion: string) {
    const control = this.getFormControl(fieldName);
    if (control) {
      control.setValue(suggestion);
    }
  }

  appendToField(fieldName: string, text: string) {
    const control = this.getFormControl(fieldName);
    if (control) {
      const currentValue = control.value || '';
      const newValue = currentValue ? `${currentValue}\n${text}` : text;
      control.setValue(newValue);
    }
  }

  private getFormControl(fieldName: string) {
    if (fieldName.includes('-')) {
      const [field, index] = fieldName.split('-');
      const arrayControl = this.cvForm.get(field) as FormArray;
      return arrayControl?.at(parseInt(index));
    }

    // Handle nested form controls
    if (fieldName === 'fullName' || fieldName === 'email' || fieldName === 'phone' || fieldName === 'address') {
      return this.cvForm.get(`personalInfo.${fieldName}`);
    }

    return this.cvForm.get(fieldName);
  }

  addExperience() {
    const experienceGroup = this.fb.group({
      company: ['', Validators.required],
      position: ['', Validators.required],
      startDate: [''],
      endDate: [''],
      description: ['']
    });
    this.experience.push(experienceGroup);
  }

  removeExperience(index: number) {
    this.experience.removeAt(index);
  }

  addEducation() {
    const educationGroup = this.fb.group({
      institution: ['', Validators.required],
      degree: ['', Validators.required],
      startDate: [''],
      endDate: ['']
    });
    this.education.push(educationGroup);
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  addSkill() {
    this.skills.push(this.fb.control('', Validators.required));
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  getSectionProgress(sectionName: string): number {
    const section = this.cvForm.get(sectionName);
    if (!section) return 0;

    const controls = Object.keys(section.value);
    const filledControls = controls.filter(key => {
      const value = section.get(key)?.value;
      return value && value.toString().trim() !== '';
    });

    return (filledControls.length / controls.length) * 100;
  }

  isFieldValid(fieldPath: string): boolean {
    const control = this.cvForm.get(fieldPath);
    return control ? control.valid && control.touched : false;
  }

  getCharacterCount(fieldName: string): number {
    const control = this.cvForm.get(fieldName);
    return control?.value ? control.value.length : 0;
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
  }

  resetForm() {
    if (confirm('Are you sure you want to reset the form? All data will be lost.')) {
      this.cvForm.reset();
      // Clear arrays
      while (this.experience.length !== 0) {
        this.experience.removeAt(0);
      }
      while (this.education.length !== 0) {
        this.education.removeAt(0);
      }
      while (this.skills.length !== 0) {
        this.skills.removeAt(0);
      }
      // Re-initialize with default entries
      this.addExperience();
      this.addEducation();
      this.addSkill();
    }
  }

  onSubmit() {
    if (this.cvForm.valid) {
      console.log('CV Data:', this.cvForm.value);
      // Here you would typically send the data to a service
      alert('CV saved successfully!');
    } else {
      alert('Please fill in all required fields.');
      this.markFormGroupTouched(this.cvForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          } else {
            arrayControl.markAsTouched();
          }
        });
      }
    });
  }
}
