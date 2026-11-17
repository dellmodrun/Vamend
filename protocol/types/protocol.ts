/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/protocol.json`.
 */
export type Protocol = {
  "address": "HZa5dYATXsrpcxM2kzHi34AsXtxFiPV7iF9cV4cRg9zc",
  "metadata": {
    "name": "protocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "buyOption",
      "discriminator": [
        242,
        253,
        221,
        183,
        67,
        244,
        140,
        119
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "mint",
          "relations": [
            "launch"
          ]
        },
        {
          "name": "launch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "arg",
                "path": "strikeLamports"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "strikeLamports",
          "type": "u64"
        },
        {
          "name": "quantity",
          "type": "u64"
        }
      ]
    },
    {
      "name": "claimForfeiture",
      "discriminator": [
        135,
        42,
        106,
        239,
        153,
        180,
        106,
        60
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "mint",
          "relations": [
            "launch"
          ]
        },
        {
          "name": "launch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          },
          "relations": [
            "position"
          ]
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "position.strikeLamports",
                "account": "optionPosition"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              }
            ]
          }
        },
        {
          "name": "buyerTokens",
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    },
    {
      "name": "createMarket",
      "discriminator": [
        103,
        226,
        97,
        235,
        200,
        188,
        251,
        254
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "canonicalName"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "canonicalName",
          "type": "string"
        }
      ]
    },
    {
      "name": "exerciseOption",
      "discriminator": [
        231,
        98,
        131,
        183,
        245,
        93,
        122,
        48
      ],
      "accounts": [
        {
          "name": "buyer",
          "writable": true,
          "signer": true,
          "relations": [
            "position"
          ]
        },
        {
          "name": "developer",
          "writable": true
        },
        {
          "name": "mint",
          "relations": [
            "launch"
          ]
        },
        {
          "name": "launch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          },
          "relations": [
            "position"
          ]
        },
        {
          "name": "position",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  112,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              },
              {
                "kind": "account",
                "path": "buyer"
              },
              {
                "kind": "account",
                "path": "position.strikeLamports",
                "account": "optionPosition"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              }
            ]
          }
        },
        {
          "name": "buyerTokens",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "quantity",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeConfig",
      "discriminator": [
        208,
        127,
        21,
        1,
        194,
        190,
        196,
        70
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "violationOracle",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "registerLaunch",
      "discriminator": [
        114,
        114,
        67,
        23,
        41,
        70,
        0,
        225
      ],
      "accounts": [
        {
          "name": "developer",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "market",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "canonicalName"
              }
            ]
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "launch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              }
            ]
          }
        },
        {
          "name": "developerTokens",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "canonicalName",
          "type": "string"
        },
        {
          "name": "lockBps",
          "type": "u16"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "expiry",
          "type": "i64"
        }
      ]
    },
    {
      "name": "reportViolation",
      "discriminator": [
        9,
        194,
        167,
        190,
        60,
        111,
        100,
        85
      ],
      "accounts": [
        {
          "name": "oracle",
          "signer": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "launch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "launch.mint",
                "account": "protectedLaunch"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "evidence",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "settleExpired",
      "discriminator": [
        187,
        68,
        57,
        40,
        121,
        72,
        73,
        161
      ],
      "accounts": [
        {
          "name": "developer",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "relations": [
            "launch"
          ]
        },
        {
          "name": "launch",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  97,
                  117,
                  110,
                  99,
                  104
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ]
          }
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "launch"
              }
            ]
          }
        },
        {
          "name": "developerTokens",
          "writable": true
        },
        {
          "name": "tokenProgram"
        }
      ],
      "args": []
    },
    {
      "name": "updateConfig",
      "discriminator": [
        29,
        158,
        252,
        191,
        10,
        83,
        219,
        99
      ],
      "accounts": [
        {
          "name": "authority",
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "newAuthority",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "newViolationOracle",
          "type": {
            "option": "pubkey"
          }
        },
        {
          "name": "paused",
          "type": {
            "option": "bool"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "marketGroup",
      "discriminator": [
        131,
        205,
        141,
        87,
        148,
        210,
        33,
        36
      ]
    },
    {
      "name": "optionPosition",
      "discriminator": [
        212,
        247,
        167,
        73,
        56,
        224,
        204,
        102
      ]
    },
    {
      "name": "protectedLaunch",
      "discriminator": [
        203,
        3,
        53,
        152,
        227,
        3,
        170,
        180
      ]
    },
    {
      "name": "protocolConfig",
      "discriminator": [
        207,
        91,
        250,
        28,
        152,
        179,
        215,
        209
      ]
    }
  ],
  "events": [
    {
      "name": "configUpdated",
      "discriminator": [
        40,
        241,
        230,
        122,
        11,
        19,
        198,
        194
      ]
    },
    {
      "name": "forfeitureClaimed",
      "discriminator": [
        146,
        49,
        174,
        122,
        199,
        108,
        75,
        250
      ]
    },
    {
      "name": "launchRegistered",
      "discriminator": [
        158,
        211,
        66,
        169,
        249,
        238,
        122,
        253
      ]
    },
    {
      "name": "launchSettled",
      "discriminator": [
        26,
        88,
        61,
        190,
        120,
        123,
        240,
        48
      ]
    },
    {
      "name": "marketCreated",
      "discriminator": [
        88,
        184,
        130,
        231,
        226,
        84,
        6,
        58
      ]
    },
    {
      "name": "optionExercised",
      "discriminator": [
        34,
        100,
        89,
        14,
        247,
        159,
        22,
        97
      ]
    },
    {
      "name": "optionPurchased",
      "discriminator": [
        9,
        175,
        211,
        168,
        31,
        202,
        39,
        191
      ]
    },
    {
      "name": "violationReported",
      "discriminator": [
        237,
        145,
        189,
        249,
        11,
        128,
        155,
        212
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "The signer is not authorized for this action"
    },
    {
      "code": 6001,
      "name": "invalidAuthority",
      "msg": "An authority or oracle address cannot be the default address"
    },
    {
      "code": 6002,
      "name": "protocolPaused",
      "msg": "The protocol is paused"
    },
    {
      "code": 6003,
      "name": "invalidCanonicalName",
      "msg": "The canonical market name is invalid"
    },
    {
      "code": 6004,
      "name": "invalidLockBps",
      "msg": "The lock must be between 2% and 10% of total supply"
    },
    {
      "code": 6005,
      "name": "invalidLockAmount",
      "msg": "The deposited amount must exactly match the declared supply lock"
    },
    {
      "code": 6006,
      "name": "invalidExpiry",
      "msg": "The expiry is outside the supported range"
    },
    {
      "code": 6007,
      "name": "unsupportedDecimals",
      "msg": "The token decimals exceed the supported maximum"
    },
    {
      "code": 6008,
      "name": "invalidOption",
      "msg": "The option quantity or strike is invalid"
    },
    {
      "code": 6009,
      "name": "insufficientInventory",
      "msg": "The launch does not have enough unreserved locked tokens"
    },
    {
      "code": 6010,
      "name": "launchNotActive",
      "msg": "The launch is not active"
    },
    {
      "code": 6011,
      "name": "optionExpired",
      "msg": "The option has expired"
    },
    {
      "code": 6012,
      "name": "launchNotExpired",
      "msg": "The launch has not expired"
    },
    {
      "code": 6013,
      "name": "launchNotForfeited",
      "msg": "The launch was not forfeited"
    },
    {
      "code": 6014,
      "name": "alreadyClaimed",
      "msg": "This forfeiture position has already been claimed"
    },
    {
      "code": 6015,
      "name": "invalidPosition",
      "msg": "The option position does not belong to this buyer and launch"
    },
    {
      "code": 6016,
      "name": "arithmeticError",
      "msg": "Arithmetic overflow or loss of precision"
    }
  ],
  "types": [
    {
      "name": "configUpdated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "violationOracle",
            "type": "pubkey"
          },
          {
            "name": "paused",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "forfeitureClaimed",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "launchRegistered",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "developer",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "lockBps",
            "type": "u16"
          },
          {
            "name": "expiry",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "launchSettled",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "returnedTokens",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "launchStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "active"
          },
          {
            "name": "forfeited"
          },
          {
            "name": "expired"
          }
        ]
      }
    },
    {
      "name": "marketCreated",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "payer",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "marketGroup",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "canonicalName",
            "type": "string"
          },
          {
            "name": "launchCount",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "optionExercised",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "quantity",
            "type": "u64"
          },
          {
            "name": "exerciseLamports",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "optionPosition",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "strikeLamports",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          },
          {
            "name": "premiumPaid",
            "type": "u64"
          },
          {
            "name": "exercisedTokens",
            "type": "u64"
          },
          {
            "name": "claimedForfeiture",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "optionPurchased",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "buyer",
            "type": "pubkey"
          },
          {
            "name": "strikeLamports",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          },
          {
            "name": "premiumLamports",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "protectedLaunch",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "market",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "developer",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "depositedTokens",
            "type": "u64"
          },
          {
            "name": "remainingTokens",
            "type": "u64"
          },
          {
            "name": "openOptionTokens",
            "type": "u64"
          },
          {
            "name": "premiumLamports",
            "type": "u64"
          },
          {
            "name": "expiry",
            "type": "i64"
          },
          {
            "name": "violationAt",
            "type": "i64"
          },
          {
            "name": "forfeitPoolTokens",
            "type": "u64"
          },
          {
            "name": "forfeitOpenOptions",
            "type": "u64"
          },
          {
            "name": "forfeitClaimedTokens",
            "type": "u64"
          },
          {
            "name": "forfeitClaimedOptions",
            "type": "u64"
          },
          {
            "name": "violationEvidence",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "lockBps",
            "type": "u16"
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "launchStatus"
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "vaultBump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "protocolConfig",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "violationOracle",
            "type": "pubkey"
          },
          {
            "name": "paused",
            "type": "bool"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "violationReported",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "launch",
            "type": "pubkey"
          },
          {
            "name": "oracle",
            "type": "pubkey"
          },
          {
            "name": "evidence",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
