
import { Component } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  baseCurrencies: { code: string; name: string }[] = [];
  targetCurrencies: { code: string; name: string }[] = [];
  filteredBaseCurrencies: { code: string; name: string }[] = [];
  filteredTargetCurrencies: { code: string; name: string }[] = [];
  baseCurrency: string = 'USD';
  targetCurrency: string = 'EUR';
  conversionAmount: number = 1; // Default value for conversion
  exchangeRates: any;
  baseAmount: number = 1; // Default value
  targetAmount: number = 0; // You can initialize it as needed
  baseflagUrl: string | undefined;
  targetflagUrl: string | undefined;
  
  selectedCurrency: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getBaseCurrencyCodesAndNames().subscribe(
      (data: any) => {
        this.baseCurrencies = data.supported_codes.map(([code, name]: [string, string]) => ({ code, name }));
      },
      (error: any) => {
        console.error('Error fetching currency codes:', error);
      }
    );
    this.dataService.getTargetCurrencyCodesAndNames().subscribe(
      (data: any) => {
        this.targetCurrencies = data.supported_codes.map(([code, name]: [string, string]) => ({ code, name }));
      },
      (error: any) => {
        console.error('Error fetching currency codes:', error);
      }
    );
  }

  getRates() {
    this.dataService.getExchangeRates(this.baseCurrency).subscribe((data: any) => {
      this.exchangeRates = data.rates;

      // Assuming you have a conversion formula, update this accordingly
      this.targetAmount = this.exchangeRates[this.targetCurrency] * this.baseAmount;
    }, (error: any) => {
      console.error('Error fetching exchange rates:', error);
    });
  }
  getCountriesBybaseCurrencyCode(currencyCode: string) {
    // Handle exceptions for USA, Euro, and Pound Sterling
    if (currencyCode === 'USD') {
      this.baseflagUrl = 'https://flagpedia.net/data/flags/w320/us.webp'; // Replace with the actual URL
    } else if (currencyCode === 'EUR') {
      this.baseflagUrl = 'https://flagpedia.net/data/org/w320/eu.webp'; // Replace with the actual URL
    } else if (currencyCode === 'GBP') {
      this.baseflagUrl = 'https://flagpedia.net/data/flags/w320/gb.webp'; // Replace with the actual URL
    } else {
      // For other currencies, fetch the flag as usual
      this.dataService.getCountryInfoByCurrencyCode(currencyCode).subscribe(
        (response: any) => {
          const flagUrl = response?.[0]?.flags?.png;
          this.baseflagUrl = flagUrl;
        },
        (error: any) => {
          console.error('Error fetching country information:', error);
        }
      );
    }
  
    this.selectedCurrency = this.baseCurrencies.find(currency => currency.code === currencyCode);
  }
  
  getCountriesBytargetCurrencyCode(currencyCode: string) {
    // Handle exceptions for USA, Euro, and Pound Sterling
    if (currencyCode === 'USD') {
      this.targetflagUrl = 'https://flagpedia.net/data/flags/w320/us.webp'; // Replace with the actual URL
    } else if (currencyCode === 'EUR') {
      this.targetflagUrl = 'https://flagpedia.net/data/org/w320/eu.webp'; // Replace with the actual URL
    } else if (currencyCode === 'GBP') {
      this.targetflagUrl = 'https://flagpedia.net/data/flags/w320/gb.webp'; // Replace with the actual URL
    } else {
      // For other currencies, fetch the flag as usual
      this.dataService.getCountryInfoByCurrencyCode(currencyCode).subscribe(
        (response: any) => {
          const flagUrl = response?.[0]?.flags?.png;
          this.targetflagUrl = flagUrl;
        },
        (error: any) => {
          console.error('Error fetching country information:', error);
        }
      );
    }
  
    this.selectedCurrency = this.targetCurrencies.find(currency => currency.code === currencyCode);
  }

  swapCurrencies() {
    // Swap the values of baseCurrency and targetCurrency
    const temp = this.baseCurrency;
    this.baseCurrency = this.targetCurrency;
    this.targetCurrency = temp;
  
    // Optionally, you can trigger the exchange rates retrieval immediately
    this.getRates();
  }

  filterBaseCurrencies(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredBaseCurrencies = this.baseCurrencies;
    } else {
      this.filteredBaseCurrencies = this.baseCurrencies.filter(currency =>
        currency.code.toLowerCase().includes(searchTerm) || currency.name.toLowerCase().includes(searchTerm)
      );
    }
  }

  filterTargetCurrencies(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTargetCurrencies = searchTerm
      ? this.targetCurrencies.filter(
          currency =>
            currency.code.toLowerCase().includes(searchTerm) || currency.name.toLowerCase().includes(searchTerm)
        )
      : this.targetCurrencies;
  }
  
}
