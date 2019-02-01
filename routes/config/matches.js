module.exports = {
	Male: {
		Heterosexual: {
			gender: {
				Female: 0,
				Other: 1,
				Male: 1
			},
			orientation: {
				Heterosexual: 0,
				Bisexual: 1,
				Other: 2,
				Homosexual: 2,
				Asexual: 2
			}
		},
		Bisexual: {
			gender: {
				Female: 0,
				Male: 0,
				Other: 1
			},
			orientation: {
				Bisexual: 0,
				Heterosexual: 0,
				Homosexual: 0,
				Other: 1,
				Asexual: 2,
				
			}
		},
		Homosexual: {
			gender: {
				Male: 0,
				Other: 1,
				Female: 1
			},
			orientation: {
				Homosexual: 0,
				Bisexual: 1,
				Other: 2,
				Asexual: 2,
				Heterosexual: 2
			}
		},
		Asexual: {
			gender: {
				Male: 0,
				Female: 0,
				Other: 0
			},
			orientation: {
				Asexual: 0,
				Heterosexual: 1,
				Bisexual: 1,
				Homosexual: 1,
				Other: 1
			}
		},
		Other: {
			gender: {
				Other: 0,
				Male: 0,
				Female: 0
			},
			orientation: {
				Other: 0,
				Asexual: 1,
				Heterosexual: 1,
				Bisexual: 1,
				Homosexual: 1,							
			}	
		}
	},
	Female: {
		Heterosexual: {
			gender: {
				Male: 0,
				Other: 1,
				Female: 1
			},
			orientation: {
				Heterosexual: 0,
				Bisexual: 1,
				Other: 2,
				Asexual: 2,
				Homosexual: 2
			}
		},
		Bisexual: {
			gender: {
				Female: 0,
				Male: 0,
				Other: 1
			},
			orientation: {
				Bisexual: 0,
				Heterosexual: 1,
				Homosexual: 1,
				Other: 2,
				Asexual: 2,
			}
		},
		Homosexual: {
			gender: {
				Female: 0,
				Male: 1,
				Other: 1
			},
			orientation: {
				Homosexual: 0,
				Bisexual: 1,
				Other: 2,
				Asexual: 2,
				Heterosexual: 2
			}
		},
		Asexual: {
			gender: {
				Male: 0,
				Female: 0,
				Other: 0
			},
			orientation: {
				Asexual: 0,
				Heterosexual: 1,
				Bisexual: 1,
				Homosexual: 1,
				Other: 1
			}
		},
		Other: {
			gender: {
				Male: 0,
				Female: 0,
				Other: 0
			},
			orientation: {
				Other: 0,
				Asexual: 1,
				Heterosexual: 1,
				Bisexual: 1,
				Homosexual: 1						
			}	
		}
	},
	Other: {
		Heterosexual: {
			gender: {
				Male: 0,
				Female: 0,
				Other: 1
			},
			orientation: {
				Heterosexual: 0,
				Bisexual: 1,
				Other: 2,
				Asexual: 2,
				Homosexual: 2
			}
		},
		Bisexual: {
			gender: {
				Female: 0,
				Male: 0,
				Other: 0
			},
			orientation: {
				Bisexual: 0,
				Heterosexual: 1,
				Homosexual: 1,
				Other: 2,
				Asexual: 2,
			}
		},
		Homosexual: {
			gender: {
				Other: 0,
				Female: 1,
				Male: 1
			},
			orientation: {
				Homosexual: 0,
				Bisexual: 1,
				Other: 2,
				Asexual: 2,
				Heterosexual: 2
			}
		},
		Asexual: {
			gender: {
				Male: 0,
				Female: 0,
				Other: 0
			},
			orientation: {
				Asexual: 0,
				Heterosexual: 1,
				Bisexual: 1,
				Homosexual: 1,
				Other: 1
			}
		},
		Other: {
			gender: {
				Male: 0,
				Female: 0,
				Other: 0
			},
			orientation: {
				Other: 0,
				Asexual: 1,
				Heterosexual: 1,
				Bisexual: 1,
				Homosexual: 1						
			}	
		}
	}
}