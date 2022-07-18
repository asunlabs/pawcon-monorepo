import { Module } from '@nestjs/common';
import { ArtworksController } from './artworks.controller';
import { ArtworksService } from './artworks.service';

@Module({
    providers: [ArtworksService],
    controllers: [ArtworksController],
})
export class ArtworksModule {}
