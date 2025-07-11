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
      imageUrl: '/images/about/Mahmoud.jpg',
      name: 'Mahmoud Ahmed', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/mahmoud-abd-almaksoud/', 
      gitHub: 'https://github.com/mahmoud-abdalmaksoud', 
      direction: 'left' 
    },
    { 
      imageUrl: '/images/about/Omar-Sherbny.jpg',
      name: 'Omar El-Shirbiny', 
      description: 'Developer', 
      linkedIn: 'https://www.linkedin.com/in/omar-el-shirbiny/', 
      gitHub: 'https://github.com/Omar-El-Shirbiny', 
      direction: 'right' 
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
    if (typeof (window as any).AOS !== 'undefined') {
      (window as any).AOS.init();
    }
  }

}
