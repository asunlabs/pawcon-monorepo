import { Get, Injectable } from '@nestjs/common';

@Injectable()
export class ArtworksService {
    @Get()
    getArtworkSample() {
        return {
            data: {
                name: 'sample name',
                title: 'sample title',
                description: 'this is a metadata for the sample',
            },
        };
    }
}
