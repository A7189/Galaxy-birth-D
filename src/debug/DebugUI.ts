import GUI from 'lil-gui';
import { orbitGroup } from '../components/PhotoManager';

export function setupGUI(): GUI {
    const gui = new GUI();

    const orbitFolder = gui.addFolder('Orbit Rotation');
    
    orbitFolder.add(orbitGroup.rotation, 'x', -Math.PI, Math.PI, 0.01).name('Rotation X');
    orbitFolder.add(orbitGroup.rotation, 'y', -Math.PI, Math.PI, 0.01).name('Rotation Y');
    orbitFolder.add(orbitGroup.rotation, 'z', -Math.PI, Math.PI, 0.01).name('Rotation Z');

    return gui;
}