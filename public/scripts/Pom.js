const Pom = (() => {
    function impl_Filtriranje(listaFiltriranihNekretnina)
    {
        const ids = listaFiltriranihNekretnina.map(obj => obj.id);
        const reqData = {nizNekretnina:ids};
        let xhttp = new XMLHttpRequest();

        xhttp.open("POST","http://localhost:3000/marketing/nekretnine",true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify(reqData));
    }

    return {
        filtriranje: impl_Filtriranje
    }

})();