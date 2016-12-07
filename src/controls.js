import * as mouse from 'mouse';
import * as selector from 'selector';
import * as events from 'events';

import BookObject from 'models/BookObject';
import ShelfObject from 'models/ShelfObject';
import SectionObject from 'models/SectionObject';
import SelectorMeta from 'models/SelectorMeta';

var objectMoved = false;

/** Triggers object select
 * @alias module:lib3d.onMouseDown
 * @param {Object} event - mouse event
 * @param {Environment} env - affected environment
 * @param {Boolean} isSideEffectsDisabled - disable side effects like focusing, selecting, moving objects
 */
export function onMouseDown(event, env, isSideEffectsDisabled) {
    mouse.down(event, env ? env.camera : null);

    if (!env || isSideEffectsDisabled) {
        return;
    }

    if (mouse.keys[1] && !mouse.keys[3]) {
        let focusedObject = focusObject(env.library, env.camera);

        if (selector.selectFocused(env.library)) {
            events.triggerSelect(focusedObject);
        }   
    }
}

/** Triggers object change
 * @alias module:lib3d.onMouseUp
 * @param {Object} event - mouse event
 * @param {Environment} env - affected environment
 * @param {Boolean} isSideEffectsDisabled - disable side effects like focusing, selecting, moving objects
 */
export function onMouseUp(event, env, isSideEffectsDisabled) {
    mouse.up(event);

    if (!env || isSideEffectsDisabled) {
        return;
    }

    if (objectMoved) {
        if(selector.isSelectedEditable()) {
            events.triggerObjectChange(selector.getSelectedObject(env.library));
        }

        objectMoved = false;
    }
}

/** Triggers object focus
 * @alias module:lib3d.onMouseMove
 * @param {Object} event - mouse event
 * @param {Environment} env - affected environment
 * @param {Boolean} isSideEffectsDisabled - disable side effects like focusing, selecting, moving objects
 */
export function onMouseMove(event, env, isSideEffectsDisabled) {
    event.preventDefault();
    mouse.move(event, env ? env.camera : null);

    if (!env || isSideEffectsDisabled) {
        return;
    }

    if(mouse.keys[1] && !mouse.keys[3]) {
        moveObject(env.library, env.camera);
    } else {
        focusObject(env.library, env.camera);
    }
}

function focusObject(library, camera) {
    let intersected;
    let focusedObject;

    if (!library || !camera) {
        return focusedObject;
    }

    //TODO: optimize
    intersected = mouse.getIntersected(library.children, true, [BookObject], camera);
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [ShelfObject], camera);
    }
    if(!intersected) {
        intersected = mouse.getIntersected(library.children, true, [SectionObject], camera);
    }

    focusedObject = intersected ? intersected.object : null;
    
    if (selector.focus(new SelectorMeta(focusedObject), library)) {
        events.triggerFocus(focusedObject);
    }

    return focusedObject;
}

function moveObject(library, camera) {
    if(!library || !camera || !selector.isSelectedEditable()) {
        return;
    }

    let selectedObject = selector.getSelectedObject(library);

    if(!selectedObject) {
        return;
    }

    let mouseVector = camera.getVector();
    let newPosition = selectedObject.position.clone();
    let parent = selectedObject.parent;
    parent.localToWorld(newPosition);

    newPosition.x -= (mouseVector.z * mouse.dX + mouseVector.x * mouse.dY) * 0.003;
    newPosition.z -= (-mouseVector.x * mouse.dX + mouseVector.z * mouse.dY) * 0.003;

    parent.worldToLocal(newPosition);
    selectedObject.move(newPosition);

    objectMoved = true;
}