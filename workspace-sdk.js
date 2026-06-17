"use strict";
(() => {
  // src/core.ts
  var _token = null;
  var _baseUrl = null;
  var Core = {
    init(token, baseUrl) {
      _token = token;
      _baseUrl = baseUrl.replace(/\/$/, "");
    },
    isReady() {
      return !!_token && !!_baseUrl;
    },
    async get(path, params = {}) {
      if (!_token || !_baseUrl) {
        throw new Error("WorkspaceSDK n\xE3o inicializado. Aguarde o WORKSPACE_INIT.");
      }
      const url = new URL(_baseUrl + path);
      Object.entries(params).forEach(([k, v]) => {
        if (v !== void 0 && v !== null) url.searchParams.set(k, String(v));
      });
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${_token}` }
      });
      if (!res.ok) throw new Error(`Erro ${res.status} em ${path}`);
      return res.json();
    }
  };

  // src/modules/frota/cadastro/veiculo.ts
  var veiculoModule = {
    listar(filtros) {
      return Core.get(
        "/Frota/Cadastro/Veiculo",
        filtros
      );
    },
    getById(id) {
      return Core.get(`/Frota/Cadastro/Veiculo/${id}`);
    }
  };

  // src/modules/frota/cadastro/motorista.ts
  var motoristaModule = {
    listar(filtros) {
      return Core.get(
        "/Frota/Cadastro/Motorista",
        filtros
      );
    },
    getById(id) {
      return Core.get(`/Frota/Cadastro/Motorista/${id}`);
    }
  };

  // src/modules/frota/movimentacao/lancamento-viagem.ts
  var lancamentoViagemModule = {
    listar(filtros) {
      return Core.get(
        "/Frota/Movimentacao/LancamentoViagem",
        filtros
      );
    },
    getById(id) {
      return Core.get(`/Frota/Movimentacao/LancamentoViagem/${id}`);
    }
  };

  // src/modules/frota/cadastro/tributacao-fiscal.ts
  var tributacaoFiscalModule = {
    listar(filtros) {
      return Core.get(
        "/Fiscal/Cadastro/TributacaoFiscal",
        filtros
      );
    },
    getById(id) {
      return Core.get(`/Fiscal/Cadastro/TributacaoFiscal/${id}`);
    }
  };

  // src/index.ts
  var WorkspaceSDK = {
    get isInitialized() {
      return Core.isReady();
    },
    frota: {
      cadastro: {
        veiculo: veiculoModule,
        motorista: motoristaModule
      },
      movimentacao: {
        lancamentoViagem: lancamentoViagemModule
      }
    },
    fiscal: {
      cadastro: {
        tributacaoFiscal: tributacaoFiscalModule
      }
    }
  };
  window.addEventListener("message", (event) => {
    if (event.data?.type === "WORKSPACE_INIT") {
      Core.init(event.data.token, event.data.baseUrl);
    }
  });
  window.WorkspaceSDK = WorkspaceSDK;
})();
