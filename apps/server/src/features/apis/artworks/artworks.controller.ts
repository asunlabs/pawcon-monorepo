import { Controller, Get } from '@nestjs/common';
import { ArtworksService } from './artworks.service';

@Controller('artworks')
export class ArtworksController {
    constructor(private artworksService: ArtworksService) {}

    @Get('/sample')
    getArtworkSample() {
        return this.artworksService.getArtworkSample();
    }
}
