import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  apiUrl = 'https://open.er-api.com/v6/latest';
  private currencyCodesApiUrl = 'https://v6.exchangerate-api.com/v6/9dce6ded49975cf5ebe42881/codes';
  private countriesUrl = 'https://restcountries.com/v3.1';

  constructor(private httpClient: HttpClient) { }

  getSymbols() {
    return new Promise(resolve => {
      this.httpClient.get(this.apiUrl).subscribe((data: any) => {
        // Extract available currencies from the response
        const currencies = Object.keys(data.rates);
        resolve(currencies);
      }, (error: any) => {
        console.log('Error fetching symbols:', error);
      });
    });
  }

  getExchangeRates(baseCurrency: string) {
    const url = `${this.apiUrl}?base=${baseCurrency}`;
    return this.httpClient.get(url);
  }
  
  getBaseCurrencyCodesAndNames() {
    return this.httpClient.get(this.currencyCodesApiUrl);
  }

  getTargetCurrencyCodesAndNames() {
    return this.httpClient.get(this.currencyCodesApiUrl);
  }

  getCountryInfoByCurrencyCode(currencyCode: string) {
    return this.httpClient.get(`${this.countriesUrl}/currency/${currencyCode}`);
  }
}
