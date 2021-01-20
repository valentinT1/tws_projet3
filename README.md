# TWS - Projet 1

Ceci est le code du projet 1 de TWS. Il a pour but de créer un guide du tourisme pour diverses randonnées à l'aide de .gpx, d'OSM et de DBpedia.

## Ressources

* BDD : GraphDB
* Serveur : Nodejs

## Installation

Il y a besoin de Git et Nodejs (dont npm).

### 1 - Cloner le project

```bash
git clone https://github.com/valentinT1/tws_projet3
```

### 2 - Installer les dépendances

```bash
npm install
```

### 3 - Exécuter le projet

Attention, il faut avoir GraphDB ouvert avec le fichier skiOntologieP3.ttl importé. La repository GraphDB doit s'appeler "ski".

```bash
npm start
```

Et voilà, les queries ont été exécutées jusqu'à ce que plus rien de nouveau ne puisse être inféré.
