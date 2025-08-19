// types/dinosaurs.ts
export interface DinosaurData {
  name: string;
  folder: string;
  model: string;
  normalMap: string;
  patterns: {
    [key: number]: string;
  };
  scale: number;
  position: [number, number, number]; // [x, y, z]
}


export const DINOSAURS: { [key: string]: DinosaurData } = {
    allosaurus: {
        name: "Allosaurus",
        folder: "Allosaurus",
        model: "/SkinViewer/Allosaurus/Allo.obj",
        normalMap: "/SkinViewer/Allosaurus/T_Allosaurus_N.png",
        patterns: {
          1: "/SkinViewer/Allosaurus/T_Allosaurus_Adult_Pattern_1.png",
          2: "/SkinViewer/Allosaurus/T_Allosaurus_Adult_Pattern_2.png",
          3: "/SkinViewer/Allosaurus/T_Allosaurus_Adult_Pattern_2.png"
        },
        scale: 0.014,
        position: [0, -2.4, 0]
    },
    beipi: {
      name: "Beipi",
      folder: "Beipi",
      model: "/SkinViewer/Beipi/Beipi.obj",
      normalMap: "/SkinViewer/Beipi/Beipaosaurus_Adult_Normal.png",
      patterns: {
        1: "/SkinViewer/Beipi/T_Beipiaosaurus_Pattern_Adult_1.png",
        2: "/SkinViewer/Beipi/T_Beipiaosaurus_Pattern_Adult_2.png",
        3: "/SkinViewer/Beipi/T_Beipiaosaurus_Pattern_Adult_3.png",
      },
      scale: 0.034,
      position: [0, -2.4, 0],
    },
    carno: {
      name: "Carno",
      folder: "Carno",
      model: "/SkinViewer/Carno/Carno.obj",
      normalMap: "/SkinViewer/Carno/T_Carno_Default_New_N.png",
      patterns: {
        1: "/SkinViewer/Carno/T_Carno_Adult_Male_Pattern_1.png",
        2: "/SkinViewer/Carno/T_Carno_Adult_Pattern_2.png",
        3: "/SkinViewer/Carno/T_Carnotaurus_Adult_Pattern_3.png",
      },
      scale: 0.0125,
      position: [0, -2.4, 0],
    },
    cerato: {
      name: "Cerato",
      folder: "Cerato",
      model: "/SkinViewer/Cerato/Cerato.obj",
      normalMap: "/SkinViewer/Cerato/T_Cerato_Adult_N.png",
      patterns: {
        1: "/SkinViewer/Cerato/T_Ceratosaurus_Adult_Pattern_1.png",
        2: "/SkinViewer/Cerato/T_Ceratosaurus_Adult_Pattern_2.png",
        3: "/SkinViewer/Cerato/T_Ceratosaurus_Adult_Pattern_3.png",
      },
      scale: 0.016,
      position: [0, -2.4, 0],
    },
    deino: {
      name: "Deino",
      folder: "Deino",
      model: "/SkinViewer/Deino/Deino.obj",
      normalMap: "/SkinViewer/Deino/T_Deinosuchus_N.png",
      patterns: {
        1: "/SkinViewer/Deino/T_Deinosuchus_Adult_Pattern_2.png",
        2: "/SkinViewer/Deino/T_Deinosuchus_Adult_Pattern_3.png",
        3: "/SkinViewer/Deino/T_Deinosuchus_Adult_Pattern_M.png",
      },
      scale: 0.014,
      position: [0, -1, 0],
    },
    dibble: {
        name: "Dibble",
        folder: "Dibble",
        model: "/SkinViewer/Dibble/Dibble.obj",
        normalMap: "/SkinViewer/Dibble/T_Diablo_Adult_N.png",
        patterns: {
          1: "/SkinViewer/Dibble/T_Diabloceratops_Adult_Pattern_1.png",
          2: "/SkinViewer/Dibble/T_Diabloceratops_Adult_Pattern_2.png",
          3: "/SkinViewer/Dibble/T_Diabloceratops_Adult_Pattern_3.png"
        },
        scale: 0.18,
        position: [0, -2.4, 0]
    },
    dilo: {
      name: "Dilo",
      folder: "Dilo",
      model: "/SkinViewer/Dilo/Dilo.obj",
      normalMap: "/SkinViewer/Dilo/T_Dilo_Base_N.png",
      patterns: {
        1: "/SkinViewer/Dilo/T_Dilophosaurus_Adult_Pattern_2.png",
        2: "/SkinViewer/Dilo/T_Dilophosaurus_Adult_Pattern_3.png",
        3: "/SkinViewer/Dilo/T_Dilophosaurus_Adult_Pattern_Default.png",
      },
      scale: 0.016,
      position: [0, -2.4, 0],
    },
    dryo: {
      name: "Dryo",
      folder: "Dryo",
      model: "/SkinViewer/Dryo/Dryo.obj",
      normalMap: "/SkinViewer/Dryo/T_Dryosaurus_N.png",
      patterns: {
        1: "/SkinViewer/Dryo/T_Dryosaurus_Adult_Pattern_1.png",
        2: "/SkinViewer/Dryo/T_Dryosaurus_Adult_Pattern_2.png",
        3: "/SkinViewer/Dryo/T_Dryosaurus_Adult_Pattern_3.png",
      },
      scale: 0.028,
      position: [0, -2.4, 0],
    },
    galli: {
      name: "Galli",
      folder: "Galli",
      model: "/SkinViewer/Galli/Galli.obj",
      normalMap: "/SkinViewer/Galli/T_Galli_Adult_Base_N.png",
      patterns: {
        1: "/SkinViewer/Galli/T_Gallimimus_Adult_Pattern_1.png",
        2: "/SkinViewer/Galli/T_Gallimimus_Adult_Pattern_2.png",
        3: "/SkinViewer/Galli/T_Gallimimus_Adult_Pattern_3.png",
      },
      scale: 0.019,
      position: [0, -3, 0],
    },
    herrera: {
      name: "Herrera",
      folder: "Herrera",
      model: "/SkinViewer/Herrera/Herrera.obj",
      normalMap: "/SkinViewer/Herrera/T_Herrerasaurus_N.png",
      patterns: {
        1: "/SkinViewer/Herrera/Herrera_Adult_Pattern.png",
        2: "/SkinViewer/Herrera/Herrera_Adult_Pattern_2.png",
        3: "/SkinViewer/Herrera/Herrera_Adult_Pattern_3.png",
      },
      scale: 0.029,
      position: [0, -2.4, 0],
    },
    hypsi: {
      name: "Hypsi",
      folder: "Hypsi",
      model: "/SkinViewer/Hypsi/Hypsi.obj",
      normalMap: "/SkinViewer/Hypsi/T_Hypsilophodon_N.png",
      patterns: {
        1: "/SkinViewer/Hypsi/T_Hypsilophodon_Adult_Pattern_1_Male.png",
        2: "/SkinViewer/Hypsi/T_Hypsilophodon_Adult_Pattern_2_Male.png",
        3: "/SkinViewer/Hypsi/T_Hypsilophodon_Adult_Pattern_3_Male.png",
      },
      scale: 0.05,
      position: [0, -2.4, 0],
    },
    maiasaura: {
        name: "Maia",
        folder: "Maiasaura",
        model: "/SkinViewer/Maiasaura/Maiasaura.obj",
        normalMap: "/SkinViewer/Maiasaura/T_Maiasaura_N.png",
        patterns: {
          1: "/SkinViewer/Maiasaura/T_Maiasaura_Pattern_Adult_1.png",
          2: "/SkinViewer/Maiasaura/T_Maiasaura_Pattern_Adult_2.png",
          3: "/SkinViewer/Maiasaura/T_Maiasaura_Pattern_Adult_3.png",
        },
        scale: 0.015,
        position: [0, -2.4, 0],
      },
    omni: {
      name: "Omni",
      folder: "Omni",
      model: "/SkinViewer/Omni/Omni.obj",
      normalMap: "/SkinViewer/Omni/T_Omniraptor_N.png",
      patterns: {
        1: "/SkinViewer/Omni/T_Omniraptor_Adult_Pattern_1.png",
        2: "/SkinViewer/Omni/T_Omniraptor_Adult_Pattern_2.png",
        3: "/SkinViewer/Omni/T_Omniraptor_Adult_Pattern_3.png",
      },
      scale: 0.02,
      position: [0, -2.4, 0],
    },
    pachy: {
      name: "Pachy",
      folder: "Pachy",
      model: "/SkinViewer/Pachy/Pachy.obj",
      normalMap: "/SkinViewer/Pachy/T_Pachy_Default_New_N.png",
      patterns: {
        1: "/SkinViewer/Pachy/T_Pachycephalosaurus_Adult_Pattern_1.png",
        2: "/SkinViewer/Pachy/T_Pachycephalosaurus_Adult_Pattern_2.png",
        3: "/SkinViewer/Pachy/T_Pachycephalosaurus_Adult_Pattern_3.png",
      },
      scale: 0.021,
      position: [0, -2.4, 0],
    },
    pter: {
      name: "Pter",
      folder: "Pter",
      model: "/SkinViewer/Pter/Pter.obj",
      normalMap: "/SkinViewer/Pter/T_Pteranodon_N.png",
      patterns: {
        1: "/SkinViewer/Pter/T_Pteranodon_Adult_Pattern_1.png",
        2: "/SkinViewer/Pter/T_Pteranodon_Adult_Pattern_2.png",
        3: "/SkinViewer/Pter/T_Pteranodon_Adult_Pattern_3.png",
      },
      scale: 0.03,
      position: [0, -0.7, 0],
    },
    stego: {
      name: "Stego",
      folder: "Stego",
      model: "/SkinViewer/Stego/Stego.obj",
      normalMap: "/SkinViewer/Stego/T_Stegosaurus_N.png",
      patterns: {
        1: "/SkinViewer/Stego/T_Stegosaurus_Adult_Pattern_1.png",
        2: "/SkinViewer/Stego/T_Stegosaurus_Adult_Pattern_2.png",
        3: "/SkinViewer/Stego/T_Stegosaurus_Adult_Pattern_3.png",
      },
      scale: 0.016,
      position: [0, -2.4, 0],
    },
    teno: {
      name: "Teno",
      folder: "Teno",
      model: "/SkinViewer/Teno/Teno.obj",
      normalMap: "/SkinViewer/Teno/T_Tenontosaurus_N.png",
      patterns: {
        1: "/SkinViewer/Teno/T_Tenontosaurus_Adult_Pattern_1.png",
        2: "/SkinViewer/Teno/T_Tenontosaurus_Adult_Pattern_2.png",
        3: "/SkinViewer/Teno/T_Tenontosaurus_Adult_Pattern_3_Male.png",
      },
      scale: 0.016,
      position: [0, -2.4, 0],
    },
    triceratops: {
        name: "Triceratops",
        folder: "Triceratops",
        model: "/SkinViewer/Triceratops/Triceratops.obj",
        normalMap: "/SkinViewer/Triceratops/T_Triceratops_N.png",
        patterns: {
          1: "/SkinViewer/Triceratops/T_Triceratops_Adult_Pattern_1.png",
          2: "/SkinViewer/Triceratops/T_Triceratops_Adult_Pattern_2.png",
          3: "/SkinViewer/Triceratops/T_Triceratops_Adult_Pattern_3.png",
        },
        scale: 0.013,
        position: [0, -2.4, 0],
    },
    troodon: {
      name: "Troodon",
      folder: "Troodon",
      model: "/SkinViewer/Troodon/Troodon.obj",
      normalMap: "/SkinViewer/Troodon/T_Troodon_N.png",
      patterns: {
        1: "/SkinViewer/Troodon/T_Troodon_Adult_Pattern_1.png",
        2: "/SkinViewer/Troodon/T_Troodon_Adult_Pattern_2.png",
        3: "/SkinViewer/Troodon/T_Troodon_Adult_Pattern_3.png",
      },
      scale: 0.05,
      position: [0, -2.4, 0],
    },
    tyrannosaurus: {
        name: "Tyrannosaurus",
        folder: "Tyrannosaurus",
        model: "/SkinViewer/Tyrannosaurus/Tyrannosaurus.obj",
        normalMap: "/SkinViewer/Tyrannosaurus/T_Tyrannosaurus_N.png",
        patterns: {
          1: "/SkinViewer/Tyrannosaurus/T_Trex_Adult_Pattern_Default.png",
          2: "/SkinViewer/Tyrannosaurus/T_Trex_Adult_Pattern_Default.png",
          3: "/SkinViewer/Tyrannosaurus/T_Trex_Adult_Pattern_Default.png"
        },
        scale: 0.01,
        position: [0, -2.4, 0]
      },
  };
  