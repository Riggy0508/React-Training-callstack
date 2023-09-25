import { onRegisterClick } from "./src/onRegisterClick";
import { updateLotteries } from './src/updateLotteries';

const registerButton:HTMLElement |null = document.getElementById('register');

if (registerButton){
    registerButton.onclick = onRegisterClick;
}

updateLotteries();

setInterval(() => updateLotteries(), 100_000); // Setting up data polling
