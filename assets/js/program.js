function nettoyer(str) {
    return str.split("\n").map(value => value.replace(/\s/g, ""))
        .filter(val => val!=="")
        .map(value => { // transforme le A => B en !A | B car js ne supporte pas A => B
            if(/(.)+=>(.)+/.test(value)) {
                let valparsed = value.split("=>")
                let newvalue = `!(${valparsed[0]}) | ${valparsed[1]}`
                return newvalue;
            }
            return value;
        })
}
function nettoyer_variables(str) {
    return new Set(str.match(/[A-Z]+/g));
}


window.addEventListener("DOMContentLoaded", () => {

    let button = document.getElementById("check");
    let base_el = document.getElementById("base");
    let but_el = document.getElementById("but");
    let sortie = document.getElementById("sortie");

    document.getElementById("form").addEventListener("submit", (e) => {
        e.preventDefault()
        sortie.innerText = "";
        let base = base_el.value;
        let but = but_el.value;
        let base_variable = [...base.match(/[A-Z]+/g)];
        let but_variable = [...but.match(/[A-Z]+/g)];
        let base_vraie = false;

        base_variable = nettoyer_variables(base);
        but_variable = nettoyer_variables(but);
        for(const variable of but_variable) {
            base_variable.add(variable);
        }
        base_variable = [...base_variable]

        let base_verites = nettoyer(base)
        let but_verites = nettoyer(but);

        let n = 2 ** base_variable.length;
        let preuve = true;
        for(let k = 0; k < n; k++) {
            let i = 0;
            for(let variable of base_variable) {
                eval(`${variable}=${k>>i&1}`)
                i++
            }
            let eval_base = base_verites.every(c=>!!eval(c));
            if(eval_base) base_vraie = true;
            if(eval_base && !eval(but_verites[0])) {
                sortie.innerText = `Base vraie mais but faux :\n${base_variable.map(c => c+":"+(!!eval(c))).join("\n")}`;
                preuve = false;
                break;
            }
        }
        if(preuve) {
            sortie.innerText += "Le but est bien conséquence des hypothèses"
        }
        if(!base_vraie) {
            sortie.innerText += "\n Votre base est toujours fausse"
        }
        sortie.classList.remove("d-none")
    })

})
