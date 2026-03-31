/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Anthropometry from './pages/Anthropometry';
import Dashboard from './pages/Dashboard';
import Financial from './pages/Financial';
import LabExams from './pages/LabExams';
import MealPlans from './pages/MealPlans';
import NutriAI from './pages/NutriAI';
import PatientDetail from './pages/PatientDetail';
import PatientProgress from './pages/PatientProgress';
import Patients from './pages/Patients';
import Schedule from './pages/Schedule';
import SeedAlimentos from './pages/SeedAlimentos';
import TabelaAlimentos from './pages/TabelaAlimentos';
import DiarioAlimentar from './pages/DiarioAlimentar';
import Settings from './pages/Settings';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Anthropometry": Anthropometry,
    "Dashboard": Dashboard,
    "Financial": Financial,
    "LabExams": LabExams,
    "MealPlans": MealPlans,
    "NutriAI": NutriAI,
    "PatientDetail": PatientDetail,
    "PatientProgress": PatientProgress,
    "Patients": Patients,
    "Schedule": Schedule,
    "SeedAlimentos": SeedAlimentos,
    "TabelaAlimentos": TabelaAlimentos,
    "DiarioAlimentar": DiarioAlimentar,
    "Settings": Settings,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};