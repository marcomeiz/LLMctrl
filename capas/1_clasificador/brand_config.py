"""
Brand Configuration Loader

Loads and provides brand-specific configuration from brands_config.yaml
for use in classification and evaluation pipelines.
"""

import os
from pathlib import Path
from typing import Dict, List, Set, Optional
import yaml


# Cache for loaded configuration
_config_cache: Optional[Dict] = None


def get_config_path() -> Path:
    """Get path to the configuration file."""
    return Path(__file__).parent / "brands_config.yaml"


def load_config() -> Dict:
    """Load configuration from YAML file (with caching)."""
    global _config_cache
    if _config_cache is None:
        config_path = get_config_path()
        if not config_path.exists():
            raise FileNotFoundError(f"Configuration file not found: {config_path}")
        with open(config_path, 'r', encoding='utf-8') as f:
            _config_cache = yaml.safe_load(f)
    return _config_cache


def reload_config() -> Dict:
    """Force reload configuration (useful for testing)."""
    global _config_cache
    _config_cache = None
    return load_config()


def get_brand_config(brand: str) -> Dict:
    """
    Get configuration for a specific brand.

    Args:
        brand: Brand name (case-insensitive)

    Returns:
        Dict with brand configuration, or empty dict if not found
    """
    config = load_config()
    brands = config.get('brands', {})

    # Case-insensitive lookup
    for brand_name, brand_config in brands.items():
        if brand_name.lower() == brand.lower():
            return brand_config

    return {}


def get_competitors(brand: str) -> Set[str]:
    """Get set of known competitors for a brand."""
    brand_config = get_brand_config(brand)
    return set(brand_config.get('competitors', []))


def get_own_products(brand: str) -> Set[str]:
    """Get set of brand's own product names (to exclude from competitor detection)."""
    brand_config = get_brand_config(brand)
    return set(brand_config.get('own_products', []))


def get_industry(brand: str) -> Optional[str]:
    """Get industry for a brand."""
    brand_config = get_brand_config(brand)
    return brand_config.get('industry')


def get_ignore_terms(brand: str, industry: Optional[str] = None) -> Set[str]:
    """
    Get all terms to ignore for a brand (combines global + industry + own products).

    Args:
        brand: Brand name
        industry: Optional industry override (used when brand not configured)

    Returns:
        Set of lowercase terms to ignore in brand detection
    """
    config = load_config()
    ignore = set()

    # Add global generic ignores
    global_config = config.get('global', {})
    for term in global_config.get('generic_ignore', []):
        ignore.add(term.lower())

    # Determine industry: from brand config or from parameter
    brand_industry = get_industry(brand)
    effective_industry = brand_industry or industry

    # Add industry-specific ignores
    if effective_industry:
        industries = config.get('industries', {})
        industry_config = industries.get(effective_industry, {})
        for term in industry_config.get('ignore_terms', []):
            ignore.add(term.lower())
        for source in industry_config.get('media_sources', []):
            ignore.add(source.lower())

    # Add brand's own products (these shouldn't be detected as competitors)
    for product in get_own_products(brand):
        ignore.add(product.lower())

    return ignore


def get_industry_ignore_terms(industry: str) -> Set[str]:
    """
    Get ignore terms for an industry (without requiring brand config).

    Args:
        industry: Industry name ('automotive', 'betting', etc.)

    Returns:
        Set of lowercase terms to ignore
    """
    config = load_config()
    ignore = set()

    # Add global generic ignores
    global_config = config.get('global', {})
    for term in global_config.get('generic_ignore', []):
        ignore.add(term.lower())

    # Add industry-specific ignores
    industries = config.get('industries', {})
    industry_config = industries.get(industry, {})
    for term in industry_config.get('ignore_terms', []):
        ignore.add(term.lower())
    for source in industry_config.get('media_sources', []):
        ignore.add(source.lower())

    return ignore


def detect_industry_from_keywords(text: str) -> Optional[str]:
    """
    Detect industry from text content (filename, sheet names, etc.).

    Args:
        text: Text to analyze for industry keywords

    Returns:
        Detected industry name or None
    """
    text_lower = text.lower()

    # Automotive keywords
    automotive_keywords = [
        'car', 'auto', 'vehicle', 'ev', 'electric', 'suv', 'sedan',
        'motor', 'drive', 'lease', 'byd', 'tesla', 'bmw', 'audi',
        'coches', 'vehículo', 'automóvil', 'eléctrico'
    ]

    # Betting keywords
    betting_keywords = [
        'bet', 'betting', 'apuesta', 'casino', 'odds', 'exchange',
        'gambling', 'poker', 'sport', 'betfair', 'bet365', 'bwin',
        'cuota', 'trading deportivo'
    ]

    automotive_score = sum(1 for kw in automotive_keywords if kw in text_lower)
    betting_score = sum(1 for kw in betting_keywords if kw in text_lower)

    if automotive_score > betting_score and automotive_score > 0:
        return 'automotive'
    elif betting_score > automotive_score and betting_score > 0:
        return 'betting'

    return None


def list_industries() -> List[str]:
    """Get list of all configured industries."""
    config = load_config()
    return list(config.get('industries', {}).keys())


def get_non_source_domains() -> Set[str]:
    """Get set of domains that should not be considered valid sources."""
    config = load_config()
    global_config = config.get('global', {})
    return set(domain.lower() for domain in global_config.get('non_source_domains', []))


def is_valid_citation_domain(domain: str) -> bool:
    """Check if a domain should be considered a valid citation source."""
    non_sources = get_non_source_domains()
    domain_lower = domain.lower()

    # Check exact match
    if domain_lower in non_sources:
        return False

    # Check if it's a subdomain of a non-source
    for non_source in non_sources:
        if domain_lower.endswith('.' + non_source) or domain_lower == non_source:
            return False

    return True


def get_language(brand: str) -> str:
    """Get language setting for a brand (defaults to 'en')."""
    brand_config = get_brand_config(brand)
    return brand_config.get('language', 'en')


# Convenience function to check if brand is configured
def is_brand_configured(brand: str) -> bool:
    """Check if a brand has configuration."""
    return bool(get_brand_config(brand))


# List all configured brands
def list_configured_brands() -> List[str]:
    """Get list of all configured brand names."""
    config = load_config()
    return list(config.get('brands', {}).keys())
