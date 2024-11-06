document.getElementById("adicionar-materia").addEventListener("click", adicionarMateria);
document.getElementById("horas-por-dia").addEventListener("input", atualizarResultados);


function adicionarMateria() {
    const materia = document.getElementById("materia").value;
    const dificuldade = parseInt(document.getElementById("dificuldade").value);
    if (materia && dificuldade >= 1 && dificuldade <= 5) {
        const materiasDisplay = document.getElementById("materias-display");
        const row = document.createElement("div");
        row.classList.add("materia-row");

        const materiaSpan = document.createElement("span");
        materiaSpan.textContent = materia;

        const dificuldadeInput = document.createElement("input");
        dificuldadeInput.type = "number";
        dificuldadeInput.value = dificuldade;
        dificuldadeInput.classList.add("dificuldade-input");
        dificuldadeInput.min = 1;
        dificuldadeInput.max = 5;
        dificuldadeInput.addEventListener("change", atualizarResultados);

        const removeButton = document.createElement("button");
        removeButton.textContent = "Remover";
        removeButton.classList.add("remove-button");
        removeButton.addEventListener("click", () => {
            row.remove();
            atualizarResultados();
            saveData();
        });

        row.appendChild(materiaSpan);
        row.appendChild(dificuldadeInput);
        row.appendChild(removeButton);
        materiasDisplay.appendChild(row);

        atualizarResultados();
        saveData();
    }
}


function atualizarResultados() {
    const horasPorDia = parseInt(document.getElementById("horas-por-dia").value);
    const materiaRows = document.querySelectorAll(".materia-row");
    let totalDificuldade = 0;
    const materias = [];

    materiaRows.forEach(row => {
        const materia = row.querySelector("span").textContent;
        const dificuldade = parseInt(row.querySelector(".dificuldade-input").value);
        materias.push({ materia, dificuldade });
        totalDificuldade += dificuldade;
    });

    const totalHorasPorSemana = horasPorDia * 7;
    const valorPorDificuldade = totalDificuldade ? totalHorasPorSemana / totalDificuldade : 0;

    const quadradosDisplay = document.getElementById("quadrados-display");
    quadradosDisplay.innerHTML = "";

    materias.forEach(({ materia, dificuldade }) => {
        const horasMateria = Math.round(dificuldade * valorPorDificuldade);
        const quadradosRow = document.createElement("div");
        quadradosRow.classList.add("quadrados-row");

        const materiaSpan = document.createElement("span");
        materiaSpan.textContent = materia;
        quadradosRow.appendChild(materiaSpan);

        for (let i = 0; i < horasMateria; i++) {
            const square = document.createElement("div");
            square.classList.add("square");

            const savedData = JSON.parse(localStorage.getItem('estudoData'));
            if (savedData && savedData.quadradosState[materia] && savedData.quadradosState[materia][i]) {
                square.classList.add("completed");
            }

            square.addEventListener("click", () => {
                square.classList.toggle("completed");
                saveData();
            });
            quadradosRow.appendChild(square);
        }
        quadradosDisplay.appendChild(quadradosRow);
    });

    document.getElementById("resultado").textContent = `Total de horas semanais: ${totalHorasPorSemana}, Valor de cada dificuldade: ${valorPorDificuldade.toFixed(2)}`;
    saveData();
}


function saveData() {
    const horasEstudo = document.getElementById('horas-por-dia').value;
    const materias = [];
    const rows = document.querySelectorAll('.materia-row');
    rows.forEach(row => {
        const nomeMateria = row.querySelector('span').textContent;
        const dificuldade = parseInt(row.querySelector('.dificuldade-input').value);
        materias.push({ nome: nomeMateria, dificuldade: dificuldade });
    });

    const quadradosState = {};
    const quadradosRows = document.querySelectorAll(".quadrados-row");
    quadradosRows.forEach(row => {
        const materiaName = row.querySelector("span").textContent;
        const completedSquares = Array.from(row.querySelectorAll(".square"))
            .map(square => square.classList.contains("completed"));
        quadradosState[materiaName] = completedSquares;
    });

    const data = {
        horasEstudo: horasEstudo,
        materias: materias,
        quadradosState: quadradosState
    };

    localStorage.setItem('estudoData', JSON.stringify(data));
}


function loadData() {
    const data = JSON.parse(localStorage.getItem('estudoData'));

    if (data) {
        document.getElementById('horas-por-dia').value = data.horasEstudo;

        data.materias.forEach(materia => {
            const row = document.createElement("div");
            row.classList.add("materia-row");

            const materiaSpan = document.createElement("span");
            materiaSpan.textContent = materia.nome;

            const dificuldadeInput = document.createElement("input");
            dificuldadeInput.type = "text";
            dificuldadeInput.value = materia.dificuldade;
            dificuldadeInput.classList.add("dificuldade-input");
            dificuldadeInput.addEventListener("change", atualizarResultados);

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remover";
            removeButton.classList.add("remove-button");
            removeButton.addEventListener("click", () => {
                row.remove();
                atualizarResultados();
                saveData();
            });

            row.appendChild(materiaSpan);
            row.appendChild(dificuldadeInput);
            row.appendChild(removeButton);
            document.getElementById("materias-display").appendChild(row);
        });

        atualizarResultados();
    }
}

window.onload = function() {
    loadData();
};


document.getElementById("resetar-btn").addEventListener("click", function() {
    const squares = document.querySelectorAll(".square.completed");
    squares.forEach(square => {
        square.classList.remove("completed");
    });
    saveData();
});
