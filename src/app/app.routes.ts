import { Routes } from '@angular/router';
import { CardComponent } from './components/card-component/card-component';

export const routes: Routes = [
    {
        path: '', redirectTo: 'board', pathMatch: 'full'
    },
    {
        path: 'board',
        component: CardComponent
    }
];
