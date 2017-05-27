import { Component, OnInit } from '@angular/core';
import { Tiles, Tile } from './tiles/tiles';
import { TileService } from './tiles/tile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  providers: [TileService],
})

export class AppComponent implements OnInit {
	tiles: Tile[];
	selectedTile: Tile;
	selectedTileNumber: number;

	constructor(private tileService: TileService) { }

	generateTileMap(): void {
		this.tileService.generateTileMap().then(tiles => this.tiles = tiles);
		
	}

	ngOnInit(): void {
		this.generateTileMap();
	}

	onSelect(tile: Tile, index: number): void {
		this.selectedTileNumber = index;
	}
}