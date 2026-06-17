<?php

namespace App\DTOs\GlobalSearchResult;

class GlobalSearchResultDto
{
    public function __construct(
        public int|string $id,
        public string $type,
        public string $title,
        public ?string $subtitle,
        public ?string $description,
        public string $url,
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'url' => $this->url,
        ];
    }
}
