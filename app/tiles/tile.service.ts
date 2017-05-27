import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { Tile } from './tiles';
import { Tiles } from './tiles';
    
@Injectable()

export class TileService {
  	generateTileMap(): Promise<Tile[]> {
  		let randomTileNumber: number;
  		const min: number = 1;
  		const max: number = 6;
		const tileMapHeight: number = 30;
		const tileMapWidth: number = 25;
		const waterTileNumber: number = 10;
		const landMass: number = 18;
		const waterFrameX: number = 1;
		const waterFrameY: number = 2;
		let tileMap: [Tile[]];
		let tileMapRow: Tile[];
		let waterRow: Tile[];
		let tileArray: Tile[];
		let surroundingTiles: object;
		let repeat: boolean;

		const createWaterRow = function() {
			waterRow = [];
			for (let x = 0; x < tileMapWidth; ++x) {
				waterRow.push(Tiles[waterTileNumber]);
			}	
			return waterRow;
		}

		const notSoRandomTileNumber = function() {
			let tileNumber: number;
			tileNumber = Math.floor(Math.random() * 100);
			if (tileNumber < 30) { tileNumber = 1; }
			else if (tileNumber < 50) { tileNumber = 2; }
			else if (tileNumber < 80) { tileNumber = 3; }
			else if (tileNumber < 90) { tileNumber = 4; }
			else if (tileNumber < 95) { tileNumber = 5; }
			else if (tileNumber < 100) { tileNumber = 6; }
			else { tileNumber = 0; }
			return tileNumber;
		}

		for (let y = 0; y < tileMapHeight; ++y) {
			if (y == 0) {
				tileMap = [createWaterRow()];
			} else if (y <= waterFrameY) {
				tileMap.push(createWaterRow());
			} else if (y + waterFrameY + 2 > tileMapHeight) {
				tileMap.push(createWaterRow());
			} else {
				tileMapRow = [];
				for (let x = 0; x < tileMapWidth; ++x) {
					if (x < waterFrameX) {
						tileMapRow.push(Tiles[waterTileNumber]);
					} else if (x + waterFrameX + 1 > tileMapWidth) {
						tileMapRow.push(Tiles[waterTileNumber]);
					} else {
						randomTileNumber = Math.floor(Math.random() * 100);
						if (randomTileNumber > landMass) {
							tileMapRow.push(Tiles[waterTileNumber]);
						} else {
	  						tileMapRow.push(Tiles[notSoRandomTileNumber()]);
						}
					}
				}	
				tileMap.push(tileMapRow);
			}	
		}

		const randomizeTile = function(x: number, y: number) {
			randomTileNumber = Math.floor(Math.random() * (max - min + 1)) + min;
			tileMap[y][x] = Tiles[notSoRandomTileNumber()];
			repeat = true;
		}

		const checkTileCombinations = function (x: number, y: number, surroundingTiles: any){
			const N: boolean = surroundingTiles.N;
			const NE: boolean = surroundingTiles.NE;
			const E: boolean = surroundingTiles.E;
			const SE: boolean = surroundingTiles.SE;
			const S: boolean = surroundingTiles.S;
			const SW: boolean = surroundingTiles.SW;
			const W: boolean = surroundingTiles.W;
			const NW: boolean = surroundingTiles.NW;

			if (N && S) {
				randomizeTile(x,y);
			} else if (E && W) {
				randomizeTile(x,y);
			} else if (NW && SE) {
				randomizeTile(x,y);
			} else if (NE && SW) {
				randomizeTile(x,y);
			} else if (N && SW && SE) {
				randomizeTile(x,y);
			} else if (E && SW && NW) {
				randomizeTile(x,y);
			} else if (S && NW && NE) {
				randomizeTile(x,y);
			} else if (W && SE && NE) {
				randomizeTile(x,y);
			}
		}

		const getSurroundingTiles = function(x: number, y: number) {
			const water: number = waterTileNumber;
			const height: number = tileMap.length - 1;
			const width: number = tileMap[0].length - 1;
			let N: boolean; 
			let NE: boolean; 
			let E: boolean; 
			let SE: boolean; 
			let S: boolean; 
			let SW: boolean; 
			let W: boolean; 
			let NW: boolean; 

			if (y > 1 && tileMap[y-2][x].id < water) {
				N = true;
			}
			if (y < height-2 && tileMap[y+2][x].id < water) {
				S = true;
			}
			if (x > 0 && tileMap[y][x-1].id < water) {
				W = true;
			}
			if (x < width && tileMap[y][x+1].id < water) {
				E = true;
			}

			if (y % 2 != 0) {
				if (y > 0 && x < width && tileMap[y-1][x+1].id < water) {
					NE = true;
				}
				if (y > 0 && tileMap[y-1][x].id < water) {
					NW = true;
				}
				if (y < height-1 && x < width && tileMap[y+1][x+1].id < water) {
					SE = true;
				}
				if (y < height-1 && tileMap[y+1][x].id < water) {
					SW = true;
				}
			} else {
				if (y > 0 && tileMap[y-1][x].id < water) {
					NE = true;
				}
				if (y > 0 && x > 0 && tileMap[y-1][x-1].id < water) {
					NW = true;
				}
				if (y < height-1 && tileMap[y+1][x].id < water) {
					SE = true;
				}
				if (y < height-1 && x > 0 && tileMap[y+1][x-1].id < water) {
					SW = true;
				}
			}
			return {N, NE, E, SE, S, SW, W, NW};
		}

		const checkTiles = function() {
			const columns: number = tileMap.length;
			const rows: number = tileMap[0].length;
			for (let y = 1; y < columns - 1; ++y) {
				for (let x = 1; x < rows - 1; ++x) {
					if (tileMap[y][x].id == waterTileNumber) {
						surroundingTiles = getSurroundingTiles(x, y);
						checkTileCombinations(x, y, surroundingTiles);
					}
				}
			}
		}

		let loopCount: number = 0;
		const repeatingChecks = function(){
			checkTiles();
			if (loopCount < 50) {
				repeat = true;
			}
			if (loopCount < 500 && repeat) {
				repeat = false;
				loopCount ++;
				repeatingChecks();
			} 
		}
		repeatingChecks();

		const checkWaterTileCombinations = function (x: number, y: number, surroundingTiles: any){
			const N: boolean = surroundingTiles.N;
			const NE: boolean = surroundingTiles.NE;
			const E: boolean = surroundingTiles.E;
			const SE: boolean = surroundingTiles.SE;
			const S: boolean = surroundingTiles.S;
			const SW: boolean = surroundingTiles.SW;
			const W: boolean = surroundingTiles.W;
			const NW: boolean = surroundingTiles.NW;

			if (NE && SE) {
				tileMap[y][x] = Tiles[20];
			} else if (SE && SW) {
				tileMap[y][x] = Tiles[21];
			} else if (SW && NW) {
				tileMap[y][x] = Tiles[22];
			} else if (NW && NE) {
				tileMap[y][x] = Tiles[19];
			} else if (N && SE) {
				tileMap[y][x] = Tiles[23];
			} else if (N && SW) {
				tileMap[y][x] = Tiles[24];
			} else if (E && SW) {
				tileMap[y][x] = Tiles[25];
			} else if (E && NW) {
				tileMap[y][x] = Tiles[26];
			} else if (S && NE) {
				tileMap[y][x] = Tiles[27];
			} else if (S && NW) {
				tileMap[y][x] = Tiles[28];
			} else if (W && SE) {
				tileMap[y][x] = Tiles[29];
			} else if (W && NE) {
				tileMap[y][x] = Tiles[30];
			} else if (NE) {
				tileMap[y][x] = Tiles[12];
			} else if (SE) {
				tileMap[y][x] = Tiles[14];
			} else if (SW) {
				tileMap[y][x] = Tiles[16];
			} else if (NW) {
				tileMap[y][x] = Tiles[18];
			} else if (N) {
				tileMap[y][x] = Tiles[11];
			} else if (E) {
				tileMap[y][x] = Tiles[13];
			} else if (S) {
				tileMap[y][x] = Tiles[15];
			} else if (W) {
				tileMap[y][x] = Tiles[17];
			}
		}

		const getWaterTiles = function() {
			const columns: number = tileMap.length;
			const rows: number = tileMap[0].length;
			for (let y = 0; y < columns; ++y) {
				for (let x = 0; x < rows; ++x) {
					if (tileMap[y][x].id == waterTileNumber) {
						surroundingTiles = getSurroundingTiles(x, y);
						checkWaterTileCombinations(x, y, surroundingTiles);
					}
				}
			}
		}
		getWaterTiles();
		
		tileArray = [];
		for (let i = 0; i < tileMap.length; ++i) {
			for (let j = 0; j < tileMapWidth; ++j) {
				tileArray.push(tileMap[i][j])
			}
		}
  		return Promise.resolve(tileArray);
  	}
}