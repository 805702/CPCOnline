const getClassNameFromId = (id, classes) => {
	let classe = classes.find(classe=>classe.idClasse === id)
	return classe.filiere.nomFiliere+" "+classe.niveau;
}
export default getClassNameFromId