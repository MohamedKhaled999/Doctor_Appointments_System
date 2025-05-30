import { SearchComponent } from './components/pages/search/search.component';
import { TestSwiperComponent } from './components/shared/test-swiper/test-swiper.component';
import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'test',
    component: TestSwiperComponent,
    title: 'Test Swiper',
  },
  {
    path: '',
    component: SearchComponent,
    title: 'Search'
  }

];
