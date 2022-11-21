
const TAP_OFFSET = 2000;
const tap_timer = new Timer();
const bpm_timer = new Timer({ startint: true });
let arrangement = new Arrangement();

const arrangement_pos_element = document.getElementById('position');
const sound_radios_element = document.getElementsByName('soundGroup');
const denominator_element = document.getElementById('denominator');
const metronome_element = document.querySelector('.metronome');
const numerator_element = document.getElementById('numerator');
const darkMode_element = document.getElementById('darkMode');
const tap_element = document.getElementById('tap');
const selected_element = document.getElementById('selected');
const bpm_element = document.getElementById('bpm');
const dot_element = document.getElementById('dot');

let volume = 1;

// loadSounds loads all the metronome sounds
function loadSounds() {
    let cla_p = new Audio("assets/classic_p.wav");
    let cla_s = new Audio("assets/classic_s.wav");
    let cli_ps = new Audio("assets/click_ps.wav");
    let woo_p = new Audio("assets/wood_p.wav");
    let woo_s = new Audio("assets/wood_s.wav");

    let classic = [cla_p, cla_s];
    let click = [cli_ps, cli_ps];
    let wood = [woo_p, woo_s];

    return [classic, click, wood];
}

// selectedSound checks for which radio button is checked
function selectedSound(radios) {
    for ( let x = 0; x < radios.length; x++ ) {
        if ( radios[x].checked ) {
            return x;
        }
    }
}

// addListeners adds event listeners to allow for inputs
function addListeners() {
    document.onkeydown = (event) => {
        switch(event.code) {
            case 'Space':
                metronome_element.click();
                break;
            case 'KeyD':
                darkMode_element.click();
                break;
            case 'KeyT':
                tap_element.click();
        }
    }

    tap_element.onclick = () => {
        tapLogic();
    }

    metronome_element.onclick = () => {
        selected_element.checked = !selected_element.checked;

        bpm_timer.stop();

        if ( selected_element.checked ) {
            bpm_timer.setInterval(60000/(bpm_element.value*4));
            arrangement.position = 0;
            bpm_timer.start();
        }
    }

    denominator_element.onchange = () => {
        arrangement.denominator = denominator_element.value;
        updateArrangementPosition();
    }

    bpm_element.onchange = () => {
        bpm_element.value = bpm_element.value.replace(/\D/g, '');
        if ( bpm_element.value == '' ) {
            bpm_element.value = 120;
        }
        bpm_timer.setInterval(60000/(bpm_element.value*4));
    }

    numerator_element.oninput = () => {
        numerator_element.value = numerator_element.value.replace(/\D/g, '');

        /* Removed this because it prevented the user from changing the numerator
         * And it does not break the code
        */
        // if ( numerator_element.value == '' ) {
        //     numerator_element.value = 4;
        // }

        numerator_element.value;
    }

    //listen for volume changes
    document.getElementById('volumeController').addEventListener('input', function() {

        volume = getVolume()
      });
}

// updateArrangementPosition does exactly what is sounds like
function updateArrangementPosition() {
    arrangement_pos_element.value = arrangement.positionString;
}

// tapLogic contains tap logic, it decides how and when the water flows
function tapLogic() {

    // resetting the tap_array, funnily enough - I didn't have to define
    // tap_array elsewhere, if the tap_array is defined here it'll stay
    // there for only this function, which is kinda sick and I don't really
    // care to make this prettier
    let ms = tap_timer.stop();
    if ( ms > TAP_OFFSET ) {
        tap_array = [];
    }

    tap_array.push(ms);

    tap_timer.start();

    // summing all the ms in array to extract mean
    let ms_sum = 0;
    tap_array.forEach((ms, index) => {
        if ( index != 0 ) {
            ms_sum += ms;
        }
    });
    let bpm_result = 60000 / (ms_sum / (tap_array.length-1))


    // showing the initial 1 - 2 - 3 - 4 instead of 'Tap'
    if ( tap_array.length < 5 ) {
        tap_element.value = tap_array.length;
    } else {
        tap_element.value = 'Tap';
        if ( !!bpm_result ) {
            bpm_element.value = parseInt(bpm_result);
            bpm_timer.setInterval(60000/(bpm_result*4));
        }
    }
}

function getVolume(){
    let slider = document.getElementById('volumeController');
    let level = document.getElementById("volumeLevel")

    let curr_volume = slider.value;  

    //side-effect -> Update current Volume percentage on screen
    level.innerHTML = curr_volume + "%"

    return curr_volume / 100
}

function main() {
    let sounds = loadSounds();

    // init the denominator value
    arrangement.denominator = denominator_element.value;

    let step = () => {
        updateArrangementPosition();

        // calculating if the metronome should tick, I figured it out like a
        // week ago and don't really have a desire to reread that so it'll
        // probably stay in this form forever, unless someone wants to do a PR
        if ( arrangement.pos % 4 == 0 ) {
            dot_element.checked = !dot_element.checked;
            if ( ( arrangement.pos / (16 / denominator_element.value) )
                % numerator_element.value == 0 ) { //Play the Downbeat(1)
                sounds[selectedSound(sound_radios_element)][0].play();
                sounds[selectedSound(sound_radios_element)][0].volume = volume;
            } else { //play subsequent beats(2,3,4)
                sounds[selectedSound(sound_radios_element)][1].play();
                sounds[selectedSound(sound_radios_element)][1].volume = volume;
            }
        }

        // advancing arrangement every step
        arrangement.move();
    }
    // setting the callback on bpm timer
    bpm_timer.setCallback(step);

    // allow for input after initalizing everything
    addListeners();
}

window.onload= (event)=>{
    main();
}