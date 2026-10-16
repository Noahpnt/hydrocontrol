
/* =====================================
   SIMULATION DE LA CENTRALE
===================================== */

function initialiserSimulation() {
    const debit = document.getElementById("debit");
    const rendement = document.getElementById("rendement");

    // Ces éléments n'existent que sur simulation.html
    if (!debit || !rendement) return;

    const hauteurFixe = 916;

    const debitValeur = document.getElementById("debitValeur");
    const rendementValeur = document.getElementById("rendementValeur");
    const resultDebit = document.getElementById("resultDebit");
    const resultHauteur = document.getElementById("resultHauteur");
    const resultRendement = document.getElementById("resultRendement");
    const puissance = document.getElementById("puissance");

    function calculerPuissance() {
        const Q = Number(debit.value);
        const H = hauteurFixe;
        const eta = Number(rendement.value) / 100;

        const rho = 1000;
        const g = 9.81;

        // P est calculée en watts, puis convertie en MW
        const P = rho * g * Q * H * eta;
        const puissanceMW = P / 1000000;

        // Mise à jour des valeurs à côté des curseurs
        if (debitValeur) {
            debitValeur.textContent = Q;
        }

        if (rendementValeur) {
            rendementValeur.textContent = rendement.value;
        }

        // Mise à jour du récapitulatif
        if (resultDebit) {
            resultDebit.textContent = Q + " m³/s";
        }

        if (resultHauteur) {
            resultHauteur.textContent = H + " m";
        }

        if (resultRendement) {
            resultRendement.textContent = rendement.value + " %";
        }

        // Mise à jour de la puissance calculée
        if (puissance) {
            puissance.textContent =
                puissanceMW.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }) + " MW";
        }
    }

    debit.addEventListener("input", calculerPuissance);
    rendement.addEventListener("input", calculerPuissance);

    // Calcul initial au chargement de la page
    calculerPuissance();
}

initialiserSimulation();


/* =====================================
   CENTRALE INTERACTIVE
===================================== */

const plantLayout = document.querySelector(".plant-layout");
const plantParts = document.querySelectorAll(".plant-part");

if (plantLayout && plantParts.length > 0) {

    const partTitle = document.getElementById("partTitle");
    const partDescription = document.getElementById("partDescription");
    const partState = document.getElementById("partState");
    const partValue = document.getElementById("partValue");
    const turbineButton = document.getElementById("turbineButton");
    const plantStatus = document.getElementById("plantStatus");

    let turbineRunning = true;

    const information = {
        reservoir: {
            title: "Le réservoir",
            description:
                "Le réservoir stocke l'eau en amont du barrage. Cette réserve permet d'alimenter la centrale selon les conditions de fonctionnement.",
            value: "Niveau : 87 %"
        },

        dam: {
            title: "Le barrage",
            description:
                "Le barrage retient l'eau et crée une différence de hauteur. Cette hauteur contribue à l'énergie disponible pour produire de l'électricité.",
            value: "Hauteur de chute : 916 m"
        },

        pipe: {
            title: "La conduite forcée",
            description:
                "Cette conduite dirige l'eau vers la turbine. Le débit de l'eau influence directement la puissance hydraulique disponible.",
            value: "Débit : 125 m³/s"
        },

        turbine: {
            title: "La turbine",
            description:
                "L'eau met la turbine en rotation. L'énergie du mouvement de l'eau est transformée en énergie mécanique.",
            value: "État : En rotation"
        },

        generator: {
            title: "L'alternateur",
            description:
                "L'alternateur est entraîné par la turbine et convertit l'énergie mécanique en énergie électrique.",
            value: "Production selon les paramètres de la centrale"
        },

        transformer: {
            title: "Le transformateur",
            description:
                "Le transformateur adapte la tension de l'électricité afin de faciliter son transport sur le réseau.",
            value: "Fonction : adaptation de la tension"
        },

        grid: {
            title: "Le réseau électrique",
            description:
                "Le réseau achemine l'électricité vers les utilisateurs : logements, entreprises et équipements publics.",
            value: "Destination : consommateurs"
        }
    };

    function afficherEquipement(nom) {
        const element = information[nom];

        if (!element) return;

        plantParts.forEach(part => {
            part.classList.toggle(
                "selected",
                part.dataset.part === nom
            );
        });

        if (partTitle) {
            partTitle.textContent = element.title;
        }

        if (partDescription) {
            partDescription.textContent = element.description;
        }

        if (partValue) {
            if (nom === "turbine") {
                partValue.textContent = turbineRunning
                    ? "État : En rotation"
                    : "État : À l'arrêt";
            } else {
                partValue.textContent = element.value;
            }
        }

        if (partState) {
            partState.textContent =
                nom === "turbine" && !turbineRunning
                    ? "À l'arrêt"
                    : "Opérationnel";
        }
    }

    // Cliquer sur les éléments du schéma
    plantParts.forEach(part => {

        part.addEventListener("click", () => {
            afficherEquipement(part.dataset.part);
        });

        // Permet aussi de sélectionner au clavier
        part.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                afficherEquipement(part.dataset.part);
            }
        });
    });

    // Démarrer ou arrêter la turbine
    if (turbineButton) {
        turbineButton.addEventListener("click", () => {

            turbineRunning = !turbineRunning;

            plantLayout.classList.toggle(
                "turbine-stopped",
                !turbineRunning
            );

            turbineButton.textContent = turbineRunning
                ? "Arrêter la turbine"
                : "Redémarrer la turbine";

            turbineButton.classList.toggle(
                "stopped",
                !turbineRunning
            );

            if (plantStatus) {
                plantStatus.textContent = turbineRunning
                    ? "● EN SERVICE"
                    : "● À L'ARRÊT";

                plantStatus.style.color = turbineRunning
                    ? "#16834a"
                    : "#b45309";

                plantStatus.style.background = turbineRunning
                    ? "#e7f7ed"
                    : "#fff1d6";
            }

            afficherEquipement("turbine");
        });
    }

    // Élément sélectionné au démarrage
    afficherEquipement("reservoir");
}