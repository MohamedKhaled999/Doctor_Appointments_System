import { Component, OnInit } from '@angular/core';
import { TeamMemberCard } from '../../../core/interfaces/TeamMemberCard.interface';
import { TeamMemberCardComponent } from "../team-member-card/team-member-card.component";
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import AOS from 'aos';


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
      direction: 'left'
    },
    {
      imageUrl: '/images/about/yasser.jpg',
      name: 'Ahmed Yasser',
      description: 'Developer',
      linkedIn: 'https://drive.google.com/file/d/1Pd_1W6KNJVPn9ZnRl5TLW_8Dp8zIotrH/view?usp=sharing',
      gitHub: 'https://github.com/AhmedYasserMohammed',
      direction: 'right'
    },
    {
      imageUrl: '/images/about/marwa.jpg',
      name: 'Marwa Mahmoud',
      description: 'Developer',
      linkedIn: 'https://www.linkedin.com/in/marwa-m-soliman',
      gitHub: 'https://github.com/MarwaMahmoudSoliman',
      direction: 'left'
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    this.initAOS();
  }

  private initAOS() {
    if (isPlatformBrowser(this.platformId)) {
      AOS.init({
        disable: false, // Matches your home component's configuration
        // Optional: Add the same additional parameters you might use elsewhere
        offset: 120,
        delay: 0,
        duration: 400,
        easing: 'ease',
        once: true,
        mirror: false
      });

      // Add refresh on window load like in your other component
      window.addEventListener('load', () => {
        AOS.refresh();
      });
    }
  }

  // Add this if you need to refresh AOS after dynamic content loads
  refreshAOS() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        AOS.refresh();
      }, 300);
    }
  }
}
