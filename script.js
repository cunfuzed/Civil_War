function changeScene(scene) {

  document.querySelectorAll('.scene').forEach(el => {
    el.classList.remove('visible');
  });

  document.getElementById(scene).classList.add('visible');
}
