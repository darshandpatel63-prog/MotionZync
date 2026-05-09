/**
 * backgroundAnimations.js
 * Animations hun animationsData.json ma thi aave chhe.
 * Navi animations add karva mate Admin Panel vaaparo: /admin
 */
import allAnimations from './animationsData.json'
const backgroundAnimations = allAnimations.filter(a => a.category === 'Background')
export default backgroundAnimations
