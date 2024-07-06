import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DiceToolsComponent } from './dice-tools/dice-tools.component';
import { LobbyComponent } from './game/lobby/lobby.component';
import { RoomComponent } from './game/room/room.component';
import { MasterRoomComponent } from './game/master-room/master-room.component';

export const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "dice-tools", component: DiceToolsComponent },
    { path: "lobby", component: LobbyComponent },
    { path: 'room/:id', component: RoomComponent },
    { path: 'master-room/:id', component: MasterRoomComponent }
];
