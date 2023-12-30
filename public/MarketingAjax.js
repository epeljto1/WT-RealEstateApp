const MarketingAjax = (() => {
    let pom = [];
    let izvrseno = false;
    function impl_osvjeziPretrage(divNekretnine)
    {
        setInterval(function() {let xhttp = new XMLHttpRequest();

        const reqData = {nizNekretnina:pom};
        xhttp.open("POST","http://localhost:3000/marketing/osvjezi",true);
        xhttp.onreadystatechange = function()
        {
            if(xhttp.readyState == 4 && xhttp.status==200)
            {
                const data = JSON.parse(xhttp.responseText);  
                const nekretnine = data.nizNekretnina;
                nekretnine.forEach(nekretnina => {
                    const divId = `pretrage-${nekretnina.id}`;
                    const pretrageDiv = divNekretnine.querySelector(`#${divId}`);
                    if(pretrageDiv) pretrageDiv.textContent = `PRETRAGE: ${nekretnina.pretrage}`;
                })
            }
        }
        if(izvrseno) {
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(reqData)); 
        }
        else {xhttp.send();}
        izvrseno = false;
    
    },500);
    }

    function impl_osvjeziKlikove(divNekretnine)
    {

    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina)
    {
        const ids = listaFiltriranihNekretnina.map(obj => obj.id);
        pom = [...ids];
        izvrseno = true;
        const reqData = {nizNekretnina:ids};
        let xhttp = new XMLHttpRequest();

        xhttp.open("POST","http://localhost:3000/marketing/nekretnine",true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(reqData));
    }

    return {
        osvjeziPretrage: impl_osvjeziPretrage,
        osvjeziKlikove: impl_osvjeziKlikove,
        novoFiltriranje: impl_novoFiltriranje
    }

})();