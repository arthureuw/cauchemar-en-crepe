import type { CrepeKind } from "./crepe3d";

export type MenuItem = {
  kind: CrepeKind;
  // Couleur pastel de la carte
  color: string;
  name: string;
  ingredients: string;
  description: string;
  // Le commentaire honnête de l'inspection
  verdict: string;
  // 1 à 5 flammes
  risk: number;
  successRate: number;
  // Altitude moyenne atteinte lors du retournement, en mètres
  altitude: string;
};

export type MenuSection = {
  id: string;
  title: string;
  subtitle: string;
  items: MenuItem[];
};

export const menu: MenuSection[] = [
  {
    id: "galettes",
    title: "Les Galettes Salées",
    subtitle: "Arthur les appelle « galettes ». Elles sont à la farine de blé. Ne le dites à aucun Breton.",
    items: [
      {
        kind: "complete",
        color: "#ffd372",
        name: "La Complète Traditionnelle",
        ingredients: "Œuf, jambon blanc, fromage râpé.",
        description:
          "Le grand classique indémodable avec un œuf mi-cuit, du jambon et du fromage fondu.",
        verdict:
          "L'œuf est mi-cuit. Enfin, cuit sur une moitié de la galette, cru sur l'autre. Arthur appelle ça « l'équilibre ».",
        risk: 2,
        successRate: 61,
        altitude: "1,8 m",
      },
      {
        kind: "chevre",
        color: "#acd084",
        name: "La Chèvre - Jambon Cru",
        ingredients: "Fromage bûchette, jambon cru, (optionnel : œuf).",
        description: "L'association du fromage de chèvre fondant et du jambon cru séché.",
        verdict:
          "Le chèvre fond. Arthur aussi, dès que quelqu'un le regarde cuisiner.",
        risk: 3,
        successRate: 48,
        altitude: "2,3 m",
      },
      {
        kind: "philadelphia",
        color: "#88c1f8",
        name: "La Crémeuse au Philadelphia",
        ingredients: "Philadelphia, jambon blanc ou cru, (optionnel : œuf ou fromage râpé).",
        description:
          "Une texture onctueuse et fraîche apportée par le Philadelphia, mariée à la charcuterie.",
        verdict:
          "Du Philadelphia dans une galette. Quelque part dans le Finistère, une grand-mère vient de lâcher son bilig.",
        risk: 3,
        successRate: 55,
        altitude: "2,0 m",
      },
      {
        kind: "gourmande",
        color: "#f6b1cf",
        name: "La Gourmande / Tout-en-un",
        ingredients:
          "Œuf, jambon blanc, jambon cru, fromage râpé, fromage bûchette, Philadelphia.",
        description:
          "La version ultra-riche qui combine tous les ingrédients salés disponibles sur la table.",
        verdict:
          "Quand Arthur n'arrive pas à choisir, il met tout. Pèse 1,2 kg. Ne se retourne pas : on la fait rouler.",
        risk: 5,
        successRate: 12,
        altitude: "0,1 m",
      },
    ],
  },
  {
    id: "crepes",
    title: "Les Crêpes Sucrées",
    subtitle: "La partie du menu où les accidents sont les plus délicieux.",
    items: [
      {
        kind: "sucre",
        color: "#ffd372",
        name: "La Sucre - Citron",
        ingredients: "Sucre, jus de citron.",
        description: "Simple, légère et acidulée pour une touche de fraîcheur.",
        verdict:
          "La seule recette qu'Arthur réussit à chaque fois. Les experts attribuent ce succès au citron.",
        risk: 1,
        successRate: 87,
        altitude: "1,2 m",
      },
      {
        kind: "nutella",
        color: "#f6b1cf",
        name: "La Classique au Nutella",
        ingredients: "Nutella.",
        description: "La valeur sûre chocolatée et gourmande.",
        verdict:
          "Dosage officiel : « oui ». Étalée à la truelle. Le pot est inclus dans le prix, il est vide de toute façon.",
        risk: 2,
        successRate: 74,
        altitude: "2,9 m",
      },
      {
        kind: "marrons",
        color: "#acd084",
        name: "La Crème de Marrons",
        ingredients: "Crème de marrons.",
        description: "Une texture riche, douce et enveloppante.",
        verdict:
          "Personne ne la commande jamais. Arthur la recommande à tout le monde quand même.",
        risk: 2,
        successRate: 70,
        altitude: "1,6 m",
      },
      {
        kind: "duo",
        color: "#88c1f8",
        name: "Le Duo Chocolat - Marron",
        ingredients: "Nutella, crème de marrons.",
        description: "Le mélange généreux pour les plus gourmands.",
        verdict:
          "Le crossover que personne n'avait demandé, mais que tout le monde finit. Les doigts aussi.",
        risk: 4,
        successRate: 39,
        altitude: "3,4 m",
      },
    ],
  },
];
