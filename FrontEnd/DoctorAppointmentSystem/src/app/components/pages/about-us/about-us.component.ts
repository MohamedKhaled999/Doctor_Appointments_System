import { Component, OnInit } from '@angular/core';
import { TeamMemberCard } from '../../../core/interfaces/TeamMemberCard.interface';
import { TeamMemberCardComponent } from "../team-member-card/team-member-card.component";
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-about-us',
  imports: [TeamMemberCardComponent, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css'
})
export class AboutUsComponent implements OnInit {
  teamMembers: TeamMemberCard[] = [
    { 
      imageUrl: '/images/about/shamy.jpg',
      name: 'Ahmed Mostafa', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/ahmed-elshamy10/', 
      gitHub: 'https://github.com/ahmed-elshamy23', 
      direction: 'right' 
    },
    { 
      imageUrl: '/images/about/Galal.jpg',
      name: 'Galal', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/galal-abo-el-magd/', 
      gitHub: 'https://github.com/GalalMohammed', 
      direction: 'left' 
    },
    { 
      imageUrl: '/images/about/Hammad.jpg',
      name: 'Mohamed Khaled', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/mohamed-khaled-mk/', 
      gitHub: 'https://github.com/MohamedKhaled999', 
      direction: 'right' 
    },
    { 
      imageUrl: '/images/about/Omar-Sherbny.jpg',
      name: 'Omar El-Shirbiny', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/omar-el-shirbiny/', 
      gitHub: 'https://github.com/Omar-El-Shirbiny', 
      direction: 'right' 
    }
    
  ];
  Acknowledgements: TeamMemberCard[] = [
    { 
      imageUrl: '/images/about/Mahmoud.jpg',
      name: 'Mahmoud Ahmed', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/mahmoud-abd-almaksoud/', 
      gitHub: 'https://github.com/mahmoud-abdalmaksoud', 
      direction: 'left' 
    },
    { 
      imageUrl: '/images/about/JustOmar.jpg',
      name: 'Omar Tarek', 
      description: 'Developer', 
      linkedIn: 'https://LinkedIn.com/in/JustOmar21', 
      gitHub: 'https://github.com/JustOmar21', 
      direction: 'left' 
    }
  ];

  ngOnInit() {
    // Initialize AOS animation
    this.initAOS();
  }

  private initAOS() {
    // You might need to install AOS types or declare it
    // if (typeof (window as any).AOS !== 'undefined') {
    //   (window as any).AOS.init();
    // }
    if (typeof window !== 'undefined' && typeof (window as any).AOS !== 'undefined') {
    (window as any).AOS.init({
      // Mobile-specific settings
      disable: function() {
        const maxWidth = 768; // Disable below tablet size
        return window.innerWidth < maxWidth;
      },
      
      // Global settings
      offset: 120, // Change offset to trigger animations sooner
      delay: 100, // Delay between animations
      duration: 600, // Duration of animation
      easing: 'ease-in-out', // Easing type
      once: true, // Whether animation should happen only once
      mirror: false, // Whether elements should animate out while scrolling past them
      anchorPlacement: 'top-bottom' // Defines which position of element triggers animation
    });

    // Refresh AOS when window is resized
    window.addEventListener('load', () => {
      (window as any).AOS.refresh();
    });
    
    window.addEventListener('resize', () => {
      (window as any).AOS.refresh();
    });
  }
  }

}
